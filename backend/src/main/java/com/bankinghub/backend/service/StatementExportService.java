package com.bankinghub.backend.service;

import com.bankinghub.backend.dto.response.AccountResponseDTO;
import com.bankinghub.backend.dto.response.TransactionResponseDTO;
import com.bankinghub.backend.exception.CustomBusinessException;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatementExportService {

    public byte[] exportToPDF(AccountResponseDTO account, List<TransactionResponseDTO> transactions, 
                             LocalDateTime fromDate, LocalDateTime toDate) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDocument = new PdfDocument(writer);
            Document document = new Document(pdfDocument);

            // Header
            Paragraph header = new Paragraph("MELVINBANK ZAMBIA")
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(header);

            Paragraph subHeader = new Paragraph("BANK STATEMENT")
                    .setFontSize(16)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(subHeader);

            document.add(new Paragraph("\n"));

            // Account Information
            document.add(new Paragraph("Account Information").setFontSize(14).setBold());
            document.add(new Paragraph("Account Name: " + account.getAccountName()));
            document.add(new Paragraph("Account Number: " + account.getMaskedAccountNumber()));
            document.add(new Paragraph("Account Type: " + account.getAccountType()));
            document.add(new Paragraph("Current Balance: ZMW " + account.getBalance()));
            
            if (fromDate != null && toDate != null) {
                document.add(new Paragraph("Statement Period: " + 
                    fromDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + 
                    " to " + toDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
            }
            
            document.add(new Paragraph("Generated On: " + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))));

            document.add(new Paragraph("\n"));

            // Transactions Table
            if (!transactions.isEmpty()) {
                document.add(new Paragraph("Transaction History").setFontSize(14).setBold());
                
                Table table = new Table(new float[]{2, 3, 2, 2, 2});
                table.setWidth(500);

                // Header
                table.addHeaderCell(new Cell().add(new Paragraph("Date").setBold())
                        .setBackgroundColor(ColorConstants.LIGHT_GRAY));
                table.addHeaderCell(new Cell().add(new Paragraph("Description").setBold())
                        .setBackgroundColor(ColorConstants.LIGHT_GRAY));
                table.addHeaderCell(new Cell().add(new Paragraph("Type").setBold())
                        .setBackgroundColor(ColorConstants.LIGHT_GRAY));
                table.addHeaderCell(new Cell().add(new Paragraph("Amount").setBold())
                        .setBackgroundColor(ColorConstants.LIGHT_GRAY));
                table.addHeaderCell(new Cell().add(new Paragraph("Balance").setBold())
                        .setBackgroundColor(ColorConstants.LIGHT_GRAY));

                // Data rows
                for (TransactionResponseDTO transaction : transactions) {
                    table.addCell(transaction.getTransactionDate()
                        .format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                    table.addCell(transaction.getDescription());
                    table.addCell(transaction.getType().toString());
                    table.addCell("ZMW " + transaction.getAmount());
                    table.addCell("ZMW " + (transaction.getBalanceAfter() != null ? 
                        transaction.getBalanceAfter() : "N/A"));
                }

                document.add(table);
            } else {
                document.add(new Paragraph("No transactions found for the specified period."));
            }

            // Footer
            document.add(new Paragraph("\n"));
            document.add(new Paragraph("This statement is computer generated and does not require a signature.")
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("MelvinBank Zambia - Banking Made Simple")
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Error generating PDF statement", e);
            throw new CustomBusinessException("Failed to generate PDF statement: " + e.getMessage());
        }
    }

    public String exportToCSV(AccountResponseDTO account, List<TransactionResponseDTO> transactions,
                             LocalDateTime fromDate, LocalDateTime toDate) {
        try {
            StringWriter writer = new StringWriter();
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                    .setHeader("Date", "Description", "Type", "Category", "Merchant", "Amount", "Balance", "Status")
                    .build();

            try (CSVPrinter csvPrinter = new CSVPrinter(writer, csvFormat)) {
                // Add account information as comments
                csvPrinter.printComment("MelvinBank Zambia - Bank Statement");
                csvPrinter.printComment("Account Name: " + account.getAccountName());
                csvPrinter.printComment("Account Number: " + account.getMaskedAccountNumber());
                csvPrinter.printComment("Account Type: " + account.getAccountType());
                csvPrinter.printComment("Current Balance: ZMW " + account.getBalance());
                
                if (fromDate != null && toDate != null) {
                    csvPrinter.printComment("Statement Period: " + 
                        fromDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + 
                        " to " + toDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                }
                
                csvPrinter.printComment("Generated On: " + 
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
                csvPrinter.printComment("");

                // Add transaction data
                for (TransactionResponseDTO transaction : transactions) {
                    csvPrinter.printRecord(
                            transaction.getTransactionDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                            transaction.getDescription(),
                            transaction.getType(),
                            transaction.getCategory() != null ? transaction.getCategory() : "",
                            transaction.getMerchant() != null ? transaction.getMerchant() : "",
                            transaction.getAmount(),
                            transaction.getBalanceAfter() != null ? transaction.getBalanceAfter() : "",
                            transaction.getStatus()
                    );
                }
            }

            return writer.toString();

        } catch (IOException e) {
            log.error("Error generating CSV statement", e);
            throw new CustomBusinessException("Failed to generate CSV statement: " + e.getMessage());
        }
    }

    public String exportToText(AccountResponseDTO account, List<TransactionResponseDTO> transactions,
                              LocalDateTime fromDate, LocalDateTime toDate) {
        StringBuilder sb = new StringBuilder();
        
        // Header
        sb.append("=====================================\n");
        sb.append("        MELVINBANK ZAMBIA\n");
        sb.append("         BANK STATEMENT\n");
        sb.append("=====================================\n\n");
        
        // Account Information
        sb.append("ACCOUNT INFORMATION:\n");
        sb.append("-------------------\n");
        sb.append("Account Name: ").append(account.getAccountName()).append("\n");
        sb.append("Account Number: ").append(account.getMaskedAccountNumber()).append("\n");
        sb.append("Account Type: ").append(account.getAccountType()).append("\n");
        sb.append("Current Balance: ZMW ").append(account.getBalance()).append("\n");
        
        if (fromDate != null && toDate != null) {
            sb.append("Statement Period: ")
                .append(fromDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .append(" to ")
                .append(toDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .append("\n");
        }
        
        sb.append("Generated On: ")
            .append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
            .append("\n\n");
        
        // Transactions
        if (!transactions.isEmpty()) {
            sb.append("TRANSACTION HISTORY:\n");
            sb.append("-------------------\n");
            sb.append(String.format("%-12s %-30s %-15s %-15s %-15s\n", 
                "Date", "Description", "Type", "Amount", "Balance"));
            sb.append("--------------------------------------------------------------------------------\n");
            
            for (TransactionResponseDTO transaction : transactions) {
                sb.append(String.format("%-12s %-30s %-15s ZMW %-10s ZMW %-10s\n",
                    transaction.getTransactionDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                    truncate(transaction.getDescription(), 30),
                    transaction.getType(),
                    transaction.getAmount(),
                    transaction.getBalanceAfter() != null ? transaction.getBalanceAfter() : "N/A"));
            }
            
            sb.append("--------------------------------------------------------------------------------\n");
            
            // Summary
            BigDecimal totalDebits = transactions.stream()
                .filter(t -> t.getType().toString().contains("WITHDRAWAL") || 
                           t.getType().toString().contains("PAYMENT") ||
                           t.getType().toString().contains("TRANSFER_OUT"))
                .map(TransactionResponseDTO::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
            BigDecimal totalCredits = transactions.stream()
                .filter(t -> t.getType().toString().contains("DEPOSIT") || 
                           t.getType().toString().contains("TRANSFER_IN") ||
                           t.getType().toString().contains("REFUND"))
                .map(TransactionResponseDTO::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            sb.append("\nSUMMARY:\n");
            sb.append("Total Credits: ZMW ").append(totalCredits).append("\n");
            sb.append("Total Debits: ZMW ").append(totalDebits).append("\n");
            sb.append("Total Transactions: ").append(transactions.size()).append("\n");
            
        } else {
            sb.append("TRANSACTION HISTORY:\n");
            sb.append("-------------------\n");
            sb.append("No transactions found for the specified period.\n");
        }
        
        sb.append("\n=====================================\n");
        sb.append("This statement is computer generated\n");
        sb.append("and does not require a signature.\n");
        sb.append("\nMelvinBank Zambia - Banking Made Simple\n");
        sb.append("=====================================\n");
        
        return sb.toString();
    }
    
    private String truncate(String text, int maxLength) {
        if (text == null) return "";
        return text.length() <= maxLength ? text : text.substring(0, maxLength - 3) + "...";
    }
}