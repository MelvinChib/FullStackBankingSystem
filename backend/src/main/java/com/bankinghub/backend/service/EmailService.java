package com.bankinghub.backend.service;

import com.bankinghub.backend.model.Account;
import com.bankinghub.backend.model.User;
import com.bankinghub.backend.model.Transaction;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.bank.name}")
    private String bankName;

    @Value("${app.bank.support-email}")
    private String supportEmail;

    @Value("${app.bank.from-email}")
    private String fromEmail;

    @Value("${app.bank.website}")
    private String bankWebsite;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    /**
     * Send welcome email with account details when user registers
     */
    public void sendWelcomeEmail(User user, Account account) {
        try {
            Context context = new Context();
            context.setVariable("userName", user.getFirstName() + " " + user.getLastName());
            context.setVariable("accountNumber", account.getAccountNumber());
            context.setVariable("accountType", account.getAccountType().toString().replace("_", " "));
            context.setVariable("accountName", account.getAccountName());
            context.setVariable("bankName", bankName);
            context.setVariable("supportEmail", supportEmail);
            context.setVariable("website", bankWebsite);
            context.setVariable("currentYear", java.time.Year.now().getValue());

            String htmlContent = templateEngine.process("email/welcome", context);
            
            sendHtmlEmail(
                user.getEmail(),
                "Welcome to " + bankName + " - Your Account is Ready!",
                htmlContent
            );
            
            log.info("Welcome email sent successfully to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", user.getEmail(), e);
        }
    }

    /**
     * Send transaction notification email
     */
    public void sendTransactionNotification(User user, Account account, Transaction transaction) {
        try {
            Context context = new Context();
            context.setVariable("userName", user.getFirstName());
            context.setVariable("transactionType", transaction.getTransactionType().toString().replace("_", " "));
            context.setVariable("amount", formatCurrency(transaction.getAmount()));
            context.setVariable("description", transaction.getDescription());
            context.setVariable("accountNumber", account.getAccountNumber());
            context.setVariable("newBalance", formatCurrency(account.getBalance()));
            context.setVariable("transactionDate", transaction.getCreatedAt().format(DATE_FORMATTER));
            context.setVariable("bankName", bankName);
            context.setVariable("supportEmail", supportEmail);
            context.setVariable("website", bankWebsite);

            String htmlContent = templateEngine.process("email/transaction-notification", context);
            
            sendHtmlEmail(
                user.getEmail(),
                bankName + " - Transaction Alert",
                htmlContent
            );
            
            log.info("Transaction notification sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send transaction notification to: {}", user.getEmail(), e);
        }
    }

    /**
     * Send account statement email
     */
    public void sendStatementEmail(User user, Account account, byte[] statementPdf) {
        try {
            Context context = new Context();
            context.setVariable("userName", user.getFirstName());
            context.setVariable("accountNumber", account.getAccountNumber());
            context.setVariable("bankName", bankName);
            context.setVariable("supportEmail", supportEmail);
            context.setVariable("website", bankWebsite);

            String htmlContent = templateEngine.process("email/statement", context);
            
            sendHtmlEmailWithAttachment(
                user.getEmail(),
                bankName + " - Account Statement",
                htmlContent,
                statementPdf,
                "statement.pdf",
                "application/pdf"
            );
            
            log.info("Statement email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send statement email to: {}", user.getEmail(), e);
        }
    }

    /**
     * Send special support escalation email
     */
    public void sendSupportEscalationEmail(User user, String subject, String message, String urgencyLevel) {
        try {
            Context context = new Context();
            context.setVariable("userName", user.getFirstName() + " " + user.getLastName());
            context.setVariable("userEmail", user.getEmail());
            context.setVariable("subject", subject);
            context.setVariable("message", message);
            context.setVariable("urgencyLevel", urgencyLevel);
            context.setVariable("bankName", bankName);
            context.setVariable("website", bankWebsite);

            String htmlContent = templateEngine.process("email/support-escalation", context);
            
            // Send to special support email (melvinchibanda@gmail.com)
            sendHtmlEmail(
                supportEmail,
                bankName + " - Customer Support Escalation: " + subject,
                htmlContent
            );
            
            // Send confirmation to user
            Context userContext = new Context();
            userContext.setVariable("userName", user.getFirstName());
            userContext.setVariable("supportEmail", supportEmail);
            userContext.setVariable("bankName", bankName);
            userContext.setVariable("website", bankWebsite);
            
            String userHtmlContent = templateEngine.process("email/support-confirmation", userContext);
            
            sendHtmlEmail(
                user.getEmail(),
                bankName + " - Support Request Received",
                userHtmlContent
            );
            
            log.info("Support escalation email sent for user: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send support escalation email for user: {}", user.getEmail(), e);
        }
    }

    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(User user, String resetToken) {
        try {
            Context context = new Context();
            context.setVariable("userName", user.getFirstName());
            context.setVariable("resetLink", bankWebsite + "/reset-password?token=" + resetToken);
            context.setVariable("bankName", bankName);
            context.setVariable("supportEmail", supportEmail);
            context.setVariable("website", bankWebsite);

            String htmlContent = templateEngine.process("email/password-reset", context);
            
            sendHtmlEmail(
                user.getEmail(),
                bankName + " - Password Reset Request",
                htmlContent
            );
            
            log.info("Password reset email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", user.getEmail(), e);
        }
    }

    /**
     * Send account security alert
     */
    public void sendSecurityAlert(User user, String alertType, String details) {
        try {
            Context context = new Context();
            context.setVariable("userName", user.getFirstName());
            context.setVariable("alertType", alertType);
            context.setVariable("details", details);
            context.setVariable("timestamp", java.time.LocalDateTime.now().format(DATE_FORMATTER));
            context.setVariable("bankName", bankName);
            context.setVariable("supportEmail", supportEmail);
            context.setVariable("website", bankWebsite);

            String htmlContent = templateEngine.process("email/security-alert", context);
            
            sendHtmlEmail(
                user.getEmail(),
                bankName + " - Security Alert",
                htmlContent
            );
            
            log.info("Security alert email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send security alert email to: {}", user.getEmail(), e);
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
    }

    private void sendHtmlEmailWithAttachment(String to, String subject, String htmlContent, 
                                           byte[] attachment, String attachmentName, String contentType) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        helper.addAttachment(attachmentName, () -> new java.io.ByteArrayInputStream(attachment), contentType);
        
        mailSender.send(message);
    }

    private String formatCurrency(BigDecimal amount) {
        return "ZMW " + String.format("%,.2f", amount);
    }
}