package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.entities.Sale;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;


import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PdfReportService {

    private static final Font TITLE_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
    private static final Font HEADER_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.BLACK);
    private static final Font NORMAL_FONT = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
    private static final Font SMALL_FONT = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.BLACK);
    private static final Font BOLD_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);

    public byte[] generateSalesReport(List<Sale> sales) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            // Crear documento PDF en formato horizontal para más columnas
            Document document = new Document(PageSize.A4.rotate(), 20, 20, 30, 30);
            PdfWriter writer = PdfWriter.getInstance(document, baos);

            document.open();

            // Título del reporte
            Paragraph title = new Paragraph("REPORTE DE VENTAS", TITLE_FONT);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Información del reporte
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

            Paragraph info = new Paragraph("Generado el: " + now.format(formatter), NORMAL_FONT);
            info.setAlignment(Element.ALIGN_RIGHT);
            info.setSpacingAfter(10);
            document.add(info);

            // Estadísticas generales
            addStatistics(document, sales);

            // Crear tabla con todas las columnas
            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1f, 2f, 2f, 2f, 2f, 2f, 2f, 1.5f});
            table.setSpacingBefore(10);

            // Headers de la tabla
            String[] headers = {"ID", "Fecha de Venta", "Usuario", "Juego",
                    "Monto Total", "Método de Pago", "Fecha Creación", "Estado"};

            for (String header : headers) {
                PdfPCell headerCell = new PdfPCell(new Phrase(header, BOLD_FONT));
                headerCell.setBackgroundColor(Color.LIGHT_GRAY);
                headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                headerCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                headerCell.setPadding(5);
                table.addCell(headerCell);
            }

            // Agregar filas de datos
            DecimalFormat currencyFormat = new DecimalFormat("#,##0.00");
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            for (Sale sale : sales) {
                // ID
                table.addCell(createDataCell(
                        sale.getId() != null ? sale.getId().toString() : "-"));

                // Fecha de Venta
                String saleDate = sale.getSaleDate() != null ?
                        sale.getSaleDate().format(dateTimeFormatter) : "-";
                table.addCell(createDataCell(saleDate));

                // Usuario
                String username = (sale.getUser() != null && sale.getUser().getUsername() != null) ?
                        sale.getUser().getUsername() : "Sin usuario";
                table.addCell(createDataCell(username));

                // Juego
                String gameName = (sale.getGame() != null && sale.getGame().getTitle() != null) ?
                        sale.getGame().getTitle() : "Sin juego";
                table.addCell(createDataCell(gameName));

                // Monto Total
                String amount = sale.getTotalAmount() != null ?
                        "$" + currencyFormat.format(sale.getTotalAmount()) : "$0.00";
                table.addCell(createDataCell(amount));

                // Método de Pago
                String paymentMethod = sale.getPaymentMethod() != null ?
                        sale.getPaymentMethod() : "No especificado";
                table.addCell(createDataCell(paymentMethod));

                // Fecha Creación
                String createdAt = sale.getCreatedAt() != null ?
                        sale.getCreatedAt().format(dateFormatter) : "-";
                table.addCell(createDataCell(createdAt));

                // Estado
                String status = sale.isActive() ? "Activo" : "Inactivo";
                PdfPCell statusCell = createDataCell(status);
                if (sale.isActive()) {
                    statusCell.setBackgroundColor(new Color(220, 252, 231)); // Verde claro
                } else {
                    statusCell.setBackgroundColor(new Color(254, 226, 226)); // Rojo claro
                }
                table.addCell(statusCell);
            }

            document.add(table);

            // Pie de página con totales
            addFooterTotals(document, sales);

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("Error generando PDF: " + e.getMessage());
        }

        return baos.toByteArray();
    }

    private PdfPCell createDataCell(String content) {
        PdfPCell cell = new PdfPCell(new Phrase(content, SMALL_FONT));
        cell.setPadding(3);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        return cell;
    }

    private void addStatistics(Document document, List<Sale> sales) throws DocumentException {
        // Calcular estadísticas
        int totalSales = sales.size();
        int activeSales = (int) sales.stream().filter(Sale::isActive).count();
        int inactiveSales = totalSales - activeSales;

        BigDecimal totalRevenue = sales.stream()
                .filter(sale -> sale.getTotalAmount() != null)
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageSale = totalSales > 0 ?
                totalRevenue.divide(BigDecimal.valueOf(totalSales), 2, RoundingMode.HALF_UP) :
                BigDecimal.ZERO;

        // Crear tabla de estadísticas
        PdfPTable statsTable = new PdfPTable(3);
        statsTable.setWidthPercentage(100);
        statsTable.setSpacingAfter(20);

        DecimalFormat currencyFormat = new DecimalFormat("#,##0.00");

        // Columna 1: Resumen de ventas
        PdfPCell cell1 = new PdfPCell();
        cell1.setPadding(10);
        cell1.setBackgroundColor(new Color(240, 248, 255));

        Paragraph p1 = new Paragraph();
        p1.add(new Phrase("RESUMEN DE VENTAS\n", HEADER_FONT));
        p1.add(new Phrase("Total de ventas: " + totalSales + "\n", NORMAL_FONT));
        p1.add(new Phrase("Ventas activas: " + activeSales + "\n", NORMAL_FONT));
        p1.add(new Phrase("Ventas inactivas: " + inactiveSales, NORMAL_FONT));
        cell1.addElement(p1);
        statsTable.addCell(cell1);

        // Columna 2: Ingresos
        PdfPCell cell2 = new PdfPCell();
        cell2.setPadding(10);
        cell2.setBackgroundColor(new Color(240, 255, 240));

        Paragraph p2 = new Paragraph();
        p2.add(new Phrase("INGRESOS\n", HEADER_FONT));
        p2.add(new Phrase("Total: $" + currencyFormat.format(totalRevenue) + "\n", NORMAL_FONT));
        p2.add(new Phrase("Promedio: $" + currencyFormat.format(averageSale), NORMAL_FONT));
        cell2.addElement(p2);
        statsTable.addCell(cell2);

        // Columna 3: Métodos de pago más comunes
        Map<String, Long> paymentMethodCount = sales.stream()
                .filter(sale -> sale.getPaymentMethod() != null)
                .collect(Collectors.groupingBy(Sale::getPaymentMethod, Collectors.counting()));

        String mostCommonPayment = paymentMethodCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        PdfPCell cell3 = new PdfPCell();
        cell3.setPadding(10);
        cell3.setBackgroundColor(new Color(255, 248, 240));

        Paragraph p3 = new Paragraph();
        p3.add(new Phrase("MÉTODOS DE PAGO\n", HEADER_FONT));
        p3.add(new Phrase("Diferentes métodos: " + paymentMethodCount.size() + "\n", NORMAL_FONT));
        p3.add(new Phrase("Más común: " + mostCommonPayment, NORMAL_FONT));
        cell3.addElement(p3);
        statsTable.addCell(cell3);

        document.add(statsTable);
    }

    private void addFooterTotals(Document document, List<Sale> sales) throws DocumentException {
        BigDecimal totalRevenue = sales.stream()
                .filter(sale -> sale.getTotalAmount() != null)
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        DecimalFormat currencyFormat = new DecimalFormat("#,##0.00");

        // Crear tabla para el footer
        PdfPTable footerTable = new PdfPTable(1);
        footerTable.setWidthPercentage(100);
        footerTable.setSpacingBefore(20);

        PdfPCell footerCell = new PdfPCell();
        footerCell.setPadding(10);
        footerCell.setBackgroundColor(new Color(248, 249, 250));
        footerCell.setBorder(Rectangle.BOX);
        footerCell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph footerParagraph = new Paragraph();
        footerParagraph.add(new Phrase("TOTAL DE REGISTROS: ", BOLD_FONT));
        footerParagraph.add(new Phrase(String.valueOf(sales.size()), NORMAL_FONT));
        footerParagraph.add(new Phrase("  |  INGRESOS TOTALES: ", BOLD_FONT));
        footerParagraph.add(new Phrase("$" + currencyFormat.format(totalRevenue), NORMAL_FONT));
        footerParagraph.setAlignment(Element.ALIGN_CENTER);

        footerCell.addElement(footerParagraph);
        footerTable.addCell(footerCell);
        document.add(footerTable);
    }

    /**
     * Genera reporte PDF personalizado con filtros aplicados
     */
    public byte[] generateCustomSalesReport(List<Sale> sales, String title, Map<String, Object> filters) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            Document document = new Document(PageSize.A4.rotate(), 20, 20, 30, 30);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Título personalizado
            Paragraph titleParagraph = new Paragraph(title.toUpperCase(), TITLE_FONT);
            titleParagraph.setAlignment(Element.ALIGN_CENTER);
            titleParagraph.setSpacingAfter(10);
            document.add(titleParagraph);

            // Mostrar filtros aplicados
            if (filters != null && !filters.isEmpty()) {
                addFiltersInfo(document, filters);
            }

            // Resto del reporte igual que el método principal
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

            Paragraph info = new Paragraph("Generado el: " + now.format(formatter), NORMAL_FONT);
            info.setAlignment(Element.ALIGN_RIGHT);
            info.setSpacingAfter(10);
            document.add(info);

            addStatistics(document, sales);

            // Crear tabla (mismo código que antes)
            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1f, 2f, 2f, 2f, 2f, 2f, 2f, 1.5f});
            table.setSpacingBefore(10);

            // Headers
            String[] headers = {"ID", "Fecha de Venta", "Usuario", "Juego",
                    "Monto Total", "Método de Pago", "Fecha Creación", "Estado"};

            for (String header : headers) {
                PdfPCell headerCell = new PdfPCell(new Phrase(header, BOLD_FONT));
                headerCell.setBackgroundColor(Color.LIGHT_GRAY);
                headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                headerCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                headerCell.setPadding(5);
                table.addCell(headerCell);
            }

            // Datos (mismo código que antes)
            DecimalFormat currencyFormat = new DecimalFormat("#,##0.00");
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            for (Sale sale : sales) {
                table.addCell(createDataCell(sale.getId() != null ? sale.getId().toString() : "-"));

                String saleDate = sale.getSaleDate() != null ?
                        sale.getSaleDate().format(dateTimeFormatter) : "-";
                table.addCell(createDataCell(saleDate));

                String username = (sale.getUser() != null && sale.getUser().getUsername() != null) ?
                        sale.getUser().getUsername() : "Sin usuario";
                table.addCell(createDataCell(username));

                String gameName = (sale.getGame() != null && sale.getGame().getTitle() != null) ?
                        sale.getGame().getTitle() : "Sin juego";
                table.addCell(createDataCell(gameName));

                String amount = sale.getTotalAmount() != null ?
                        "$" + currencyFormat.format(sale.getTotalAmount()) : "$0.00";
                table.addCell(createDataCell(amount));

                String paymentMethod = sale.getPaymentMethod() != null ?
                        sale.getPaymentMethod() : "No especificado";
                table.addCell(createDataCell(paymentMethod));

                String createdAt = sale.getCreatedAt() != null ?
                        sale.getCreatedAt().format(dateFormatter) : "-";
                table.addCell(createDataCell(createdAt));

                String status = sale.isActive() ? "Activo" : "Inactivo";
                PdfPCell statusCell = createDataCell(status);
                if (sale.isActive()) {
                    statusCell.setBackgroundColor(new Color(220, 252, 231));
                } else {
                    statusCell.setBackgroundColor(new Color(254, 226, 226));
                }
                table.addCell(statusCell);
            }

            document.add(table);
            addFooterTotals(document, sales);
            document.close();

        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("Error generando PDF personalizado: " + e.getMessage());
        }

        return baos.toByteArray();
    }

    private void addFiltersInfo(Document document, Map<String, Object> filters) throws DocumentException {
        Paragraph filtersTitle = new Paragraph("Filtros aplicados:", BOLD_FONT);
        filtersTitle.setSpacingAfter(5);
        document.add(filtersTitle);

        // Use com.lowagie.text.List instead of java.util.List
        com.lowagie.text.List filtersList = new com.lowagie.text.List(false, 10); // false = unordered list, 10 = indent
        filtersList.setListSymbol(new Chunk("• ", FontFactory.getFont(FontFactory.HELVETICA, 12)));

        filters.forEach((key, value) -> {
            if (value != null && !value.toString().isEmpty()) {
                String filterText = formatFilterText(key, value.toString());
                filtersList.add(new ListItem(filterText, SMALL_FONT));
            }
        });

        if (!filtersList.isEmpty()) {
            document.add(filtersList); // Remove the (Element) cast as it's not needed
        }

        Paragraph separator = new Paragraph(" ");
        separator.setSpacingAfter(10);
        document.add(separator);
    }

    private String formatFilterText(String key, String value) {
        switch (key) {
            case "active":
                return "Estado: " + (Boolean.parseBoolean(value) ? "Activo" : "Inactivo");
            case "startDate":
                return "Fecha desde: " + value;
            case "endDate":
                return "Fecha hasta: " + value;
            case "paymentMethod":
                return "Método de pago: " + value;
            case "username":
                return "Usuario: " + value;
            case "gameName":
                return "Juego: " + value;
            case "minAmount":
                return "Monto mínimo: $" + value;
            case "maxAmount":
                return "Monto máximo: $" + value;
            default:
                return key + ": " + value;
        }
    }
}