# Contributing to SwiftBank

Thank you for your interest in contributing to SwiftBank! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [How to Contribute](#how-to-contribute)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Reporting Bugs](#reporting-bugs)
9. [Suggesting Features](#suggesting-features)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or discriminatory comments
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:
- Java 17 JDK installed
- Maven 3.8+ installed
- Node.js 16+ and npm installed
- Git installed and configured
- A GitHub account
- Basic knowledge of Spring Boot and React

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/FullStackBankingSystem.git
   cd FullStackBankingSystem-master
   ```
3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/FullStackBankingSystem.git
   ```

---

## 🛠️ Development Setup

### Backend Setup

```bash
cd backend

# Verify Java 17
java -version

# Build project
mvn clean install

# Run tests
mvn test

# Start development server
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

### Verify Setup

- Backend: http://localhost:8080/actuator/health
- Frontend: http://localhost:5173

---

## 🤝 How to Contribute

### Types of Contributions

We welcome:
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance improvements
- 🧪 Test coverage improvements
- 🔒 Security enhancements

### Contribution Workflow

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes:**
   - Write clean, maintainable code
   - Follow coding standards (see below)
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Keep your fork updated:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

---

## 💻 Coding Standards

### Backend (Java/Spring Boot)

#### Code Style
- Use **4 spaces** for indentation
- Follow **Java naming conventions**:
  - Classes: `PascalCase`
  - Methods/variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
- Maximum line length: **120 characters**
- Use **Lombok** annotations to reduce boilerplate

#### Best Practices
```java
// ✅ Good
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}

// ❌ Bad
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User findById(Long id) {
        User user = userRepository.findById(id).get(); // No error handling
        return user;
    }
}
```

#### Security Guidelines
- **Never hardcode credentials** - use environment variables
- **Validate all inputs** - use Jakarta Bean Validation
- **Sanitize user input** - prevent XSS and SQL injection
- **Use parameterized queries** - JPA handles this
- **Hash passwords** - use BCrypt (already configured)

### Frontend (React/JavaScript)

#### Code Style
- Use **2 spaces** for indentation
- Use **functional components** with hooks
- Follow **React naming conventions**:
  - Components: `PascalCase`
  - Functions/variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
- Maximum line length: **100 characters**

#### Best Practices
```javascript
// ✅ Good
import { useState, useEffect } from 'react';
import apiService from '../services/api';

const AccountDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await apiService.getUserAccounts();
        setAccounts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccounts();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {accounts.map(account => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
};

export default AccountDashboard;

// ❌ Bad
class AccountDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { accounts: [] };
  }
  
  componentDidMount() {
    fetch('http://localhost:8080/api/v1/accounts') // Hardcoded URL
      .then(res => res.json())
      .then(data => this.setState({ accounts: data }));
  }
  
  render() {
    return <div>{/* ... */}</div>;
  }
}
```

#### Styling Guidelines
- Use **Tailwind CSS** utility classes
- Follow **mobile-first** approach
- Maintain **FNB-inspired theme** (teal/white/orange)
- Ensure **accessibility** (ARIA labels, keyboard navigation)

---

## 🧪 Testing Guidelines

### Backend Testing

```java
@SpringBootTest
@AutoConfigureMockMvc
class UserServiceTest {
    
    @Autowired
    private UserService userService;
    
    @MockBean
    private UserRepository userRepository;
    
    @Test
    void testFindById_Success() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        // Act
        User result = userService.findById(1L);
        
        // Assert
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }
    
    @Test
    void testFindById_NotFound() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.findById(999L);
        });
    }
}
```

### Frontend Testing

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountDashboard from './AccountDashboard';
import apiService from '../services/api';

jest.mock('../services/api');

describe('AccountDashboard', () => {
  test('renders accounts successfully', async () => {
    const mockAccounts = [
      { id: 1, accountName: 'Checking', balance: 1000 },
      { id: 2, accountName: 'Savings', balance: 5000 }
    ];
    
    apiService.getUserAccounts.mockResolvedValue(mockAccounts);
    
    render(<AccountDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Checking')).toBeInTheDocument();
      expect(screen.getByText('Savings')).toBeInTheDocument();
    });
  });
  
  test('displays error message on failure', async () => {
    apiService.getUserAccounts.mockRejectedValue(new Error('API Error'));
    
    render(<AccountDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### Test Coverage Requirements

- **Backend**: Minimum 70% code coverage
- **Frontend**: Minimum 60% code coverage
- All new features must include tests
- Bug fixes should include regression tests

---

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows project coding standards
- [ ] All tests pass (`mvn test` and `npm test`)
- [ ] New tests added for new functionality
- [ ] Documentation updated (if applicable)
- [ ] No hardcoded credentials or sensitive data
- [ ] Commit messages follow convention (see below)
- [ ] Branch is up to date with main

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add password reset functionality

Implemented password reset flow with email verification.
Users can now request password reset via email.

Closes #123

fix(api): resolve null pointer exception in account service

Added null check before accessing account balance.

Fixes #456

docs(readme): update installation instructions

Added troubleshooting section for common setup issues.
```

### PR Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #issue_number
```

### Review Process

1. **Automated checks** run (tests, linting)
2. **Code review** by maintainers
3. **Feedback addressed** by contributor
4. **Approval** from at least one maintainer
5. **Merge** into main branch

---

## 🐛 Reporting Bugs

### Before Reporting

- Check if the bug has already been reported
- Verify it's reproducible in the latest version
- Collect relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 96]
- Java Version: [e.g., 17]
- Node Version: [e.g., 16.14]

**Additional context**
Any other relevant information.
```

---

## ✨ Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context, mockups, or examples.

**Would you like to implement this feature?**
- [ ] Yes, I'd like to implement it
- [ ] No, just suggesting
```

---

## 📞 Getting Help

If you need help:

- 📧 **Email**: melvinchibanda@gmail.com
- 💬 **GitHub Discussions**: Ask questions in discussions
- 🐛 **GitHub Issues**: Report bugs or request features
- 📚 **Documentation**: Check README.md and other docs

---

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to SwiftBank!** 🇿🇲

*Together, we're building better banking software for Zambia.*
