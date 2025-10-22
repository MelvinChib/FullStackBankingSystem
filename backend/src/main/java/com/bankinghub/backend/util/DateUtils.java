package com.bankinghub.backend.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

public class DateUtils {

    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String DISPLAY_DATE_FORMAT = "dd/MM/yyyy";
    public static final String DISPLAY_DATETIME_FORMAT = "dd/MM/yyyy HH:mm";

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern(DATE_FORMAT);
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern(DATETIME_FORMAT);
    private static final DateTimeFormatter DISPLAY_DATE_FORMATTER = DateTimeFormatter.ofPattern(DISPLAY_DATE_FORMAT);
    private static final DateTimeFormatter DISPLAY_DATETIME_FORMATTER = DateTimeFormatter.ofPattern(DISPLAY_DATETIME_FORMAT);

    /**
     * Format LocalDate to string
     */
    public static String formatDate(LocalDate date) {
        return date != null ? date.format(DATE_FORMATTER) : null;
    }

    /**
     * Format LocalDateTime to string
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATETIME_FORMATTER) : null;
    }

    /**
     * Format LocalDate for display
     */
    public static String formatDateForDisplay(LocalDate date) {
        return date != null ? date.format(DISPLAY_DATE_FORMATTER) : null;
    }

    /**
     * Format LocalDateTime for display
     */
    public static String formatDateTimeForDisplay(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DISPLAY_DATETIME_FORMATTER) : null;
    }

    /**
     * Parse date string to LocalDate
     */
    public static LocalDate parseDate(String dateString) {
        try {
            return dateString != null ? LocalDate.parse(dateString, DATE_FORMATTER) : null;
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format: " + dateString);
        }
    }

    /**
     * Parse datetime string to LocalDateTime
     */
    public static LocalDateTime parseDateTime(String dateTimeString) {
        try {
            return dateTimeString != null ? LocalDateTime.parse(dateTimeString, DATETIME_FORMATTER) : null;
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid datetime format: " + dateTimeString);
        }
    }

    /**
     * Get start of current month
     */
    public static LocalDate getCurrentMonthStart() {
        return LocalDate.now().withDayOfMonth(1);
    }

    /**
     * Get end of current month
     */
    public static LocalDate getCurrentMonthEnd() {
        return LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
    }

    /**
     * Get start of current year
     */
    public static LocalDate getCurrentYearStart() {
        return LocalDate.now().withDayOfYear(1);
    }

    /**
     * Get end of current year
     */
    public static LocalDate getCurrentYearEnd() {
        return LocalDate.now().withDayOfYear(LocalDate.now().lengthOfYear());
    }

    /**
     * Calculate days between two dates
     */
    public static long daysBetween(LocalDate startDate, LocalDate endDate) {
        return ChronoUnit.DAYS.between(startDate, endDate);
    }

    /**
     * Calculate months between two dates
     */
    public static long monthsBetween(LocalDate startDate, LocalDate endDate) {
        return ChronoUnit.MONTHS.between(startDate, endDate);
    }

    /**
     * Check if date is in the past
     */
    public static boolean isPastDate(LocalDate date) {
        return date != null && date.isBefore(LocalDate.now());
    }

    /**
     * Check if date is in the future
     */
    public static boolean isFutureDate(LocalDate date) {
        return date != null && date.isAfter(LocalDate.now());
    }

    /**
     * Check if date is today
     */
    public static boolean isToday(LocalDate date) {
        return date != null && date.equals(LocalDate.now());
    }

    /**
     * Add days to a date
     */
    public static LocalDate addDays(LocalDate date, long days) {
        return date != null ? date.plusDays(days) : null;
    }

    /**
     * Add months to a date
     */
    public static LocalDate addMonths(LocalDate date, long months) {
        return date != null ? date.plusMonths(months) : null;
    }

    /**
     * Get the first day of next month
     */
    public static LocalDate getFirstDayOfNextMonth(LocalDate date) {
        return date != null ? date.plusMonths(1).withDayOfMonth(1) : null;
    }

    /**
     * Get the last day of month
     */
    public static LocalDate getLastDayOfMonth(LocalDate date) {
        return date != null ? date.withDayOfMonth(date.lengthOfMonth()) : null;
    }
}