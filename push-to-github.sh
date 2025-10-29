#!/bin/bash

# SwiftBank - GitHub Push Script
# Author: Melvin Musonda Chibanda
# Version: 2.0.0

echo "========================================="
echo "SwiftBank - Push to GitHub"
echo "========================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized"
    echo "Run: git init"
    exit 1
fi

# Check current status
echo "Current Git Status:"
echo "-------------------"
git status
echo ""

# Add all untracked files
echo "Adding untracked files..."
git add FIXES_APPLIED.md
git add PROJECT_STRUCTURE.md
git add QUICK_START.md
git add SECURITY_AUDIT_COMPLETE.md
git add SECURITY_CONFIGURATION.md
git add SETUP_COMPLETE.md
git add backend/JAVADOC_DOCUMENTATION.md
git add generate-javadoc.sh
git add push-to-github.sh

# Add all modified files
git add -u

echo "✓ Files staged for commit"
echo ""

# Show what will be committed
echo "Files to be committed:"
echo "---------------------"
git status --short
echo ""

# Prompt for commit message
read -p "Enter commit message (or press Enter for default): " commit_msg

if [ -z "$commit_msg" ]; then
    commit_msg="v2.0.0 - Added comprehensive JavaDoc documentation to all classes"
fi

# Commit changes
echo ""
echo "Committing changes..."
git commit -m "$commit_msg"
echo "✓ Changes committed"
echo ""

# Check remote
remote_url=$(git remote get-url origin 2>/dev/null)

if [ -z "$remote_url" ]; then
    echo "⚠️  No remote repository configured"
    echo ""
    echo "To add remote repository:"
    echo "git remote add origin https://github.com/MelvinChib/FullStackBankingSystem.git"
    echo ""
    read -p "Do you want to add remote now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter GitHub repository URL: " repo_url
        git remote add origin "$repo_url"
        echo "✓ Remote added"
    else
        echo "Skipping push. Add remote manually and run: git push -u origin main"
        exit 0
    fi
else
    echo "Remote repository: $remote_url"
fi

echo ""

# Push to GitHub
echo "Pushing to GitHub..."
echo "-------------------"

# Check if main branch exists
current_branch=$(git branch --show-current)

if [ -z "$current_branch" ]; then
    echo "Creating main branch..."
    git branch -M main
    current_branch="main"
fi

echo "Current branch: $current_branch"
echo ""

# Push
git push -u origin "$current_branch"

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "✓ Successfully pushed to GitHub!"
    echo "========================================="
    echo ""
    echo "Repository: $remote_url"
    echo "Branch: $current_branch"
    echo ""
    echo "View your repository:"
    echo "https://github.com/MelvinChib/FullStackBankingSystem"
    echo ""
else
    echo ""
    echo "❌ Push failed"
    echo ""
    echo "Common issues:"
    echo "1. Authentication required - Use Personal Access Token (PAT)"
    echo "   Create PAT: https://github.com/settings/tokens"
    echo ""
    echo "2. Branch protection - Check repository settings"
    echo ""
    echo "3. Network issues - Check internet connection"
    echo ""
    echo "Try manual push:"
    echo "git push -u origin $current_branch"
    echo ""
fi
