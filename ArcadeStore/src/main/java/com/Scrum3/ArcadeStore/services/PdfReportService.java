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

    private final DecimalFormat currencyFormat = new DecimalFormat("#,##0.00");
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public byte[] generateSalesReport(List<Sale> sales) throws Exception {
        return generateCustomSalesReport(sales, "REPORTE DE VENTAS", null);
    }

    public byte[] generateCustomSalesReport(List<Sale> sales, String title, Map<String, Object> filters) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            Document document = new Document(PageSize.A4.rotate(), 20, 20, 30, 30);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Título del documento
            Paragraph titleParagraph = new Paragraph(title.toUpperCase(), TITLE_FONT);
            titleParagraph.setAlignment(Element.ALIGN_CENTER);
            titleParagraph.setSpacingAfter(10);
            document.add(titleParagraph);

            // Mostrar filtros
            if (filters != null && !filters.isEmpty()) {
                addFiltersInfo(document, filters);
            }

            // Fecha de generación
            LocalDateTime now = LocalDateTime.now();
            Paragraph info = new Paragraph("Generado el: " + now.format(dateTimeFormatter), NORMAL_FONT);
            info.setAlignment(Element.ALIGN_RIGHT);
            info.setSpacingAfter(10);
            document.add(info);

            // Si no hay ventas
            if (sales.isEmpty()) {
                Paragraph noData = new Paragraph("No se encontraron ventas para los criterios seleccionados.", NORMAL_FONT);
                noData.setSpacingBefore(20);
                document.add(noData);
                document.close();
                return baos.toByteArray();
            }

            addStatistics(document, sales);

            PdfPTable table = createSalesTable(sales);
            document.add(table);

            addFooterTotals(document, sales);

            document.close();
        } catch (Exception e) {
            throw new Exception("Error generando PDF: " + e.getMessage());
        }

        return baos.toByteArray();
    }

    private PdfPTable createSalesTable(List<Sale> sales) throws DocumentException {
        PdfPTable table = new PdfPTable(8);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1f, 2f, 2f, 2f, 2f, 2f, 2f, 1.5f});
        table.setSpacingBefore(10);
        table.setHeaderRows(1); // Repite encabezados

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

        for (Sale sale : sales) {
            table.addCell(createDataCell(sale.getId() != null ? sale.getId().toString() : "-"));
            table.addCell(createDataCell(sale.getSaleDate() != null ? sale.getSaleDate().format(dateTimeFormatter) : "-"));
            table.addCell(createDataCell((sale.getUser() != null && sale.getUser().getUsername() != null) ? sale.getUser().getUsername() : "Sin usuario"));
            table.addCell(createDataCell((sale.getGame() != null && sale.getGame().getTitle() != null) ? sale.getGame().getTitle() : "Sin juego"));
            table.addCell(createDataCell(sale.getTotalAmount() != null ? "$" + currencyFormat.format(sale.getTotalAmount()) : "$0.00"));
            table.addCell(createDataCell(sale.getPaymentMethod() != null ? sale.getPaymentMethod() : "No especificado"));
            table.addCell(createDataCell(sale.getCreatedAt() != null ? sale.getCreatedAt().format(dateFormatter) : "-"));

            PdfPCell statusCell = createDataCell(sale.isActive() ? "Activo" : "Inactivo");
            statusCell.setBackgroundColor(sale.isActive() ? new Color(220, 252, 231) : new Color(254, 226, 226));
            table.addCell(statusCell);
        }

        return table;
    }

    private PdfPCell createDataCell(String content) {
        PdfPCell cell = new PdfPCell(new Phrase(content, SMALL_FONT));
        cell.setPadding(3);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        return cell;
    }

    private void addStatistics(Document document, List<Sale> sales) throws DocumentException {
        int totalSales = sales.size();
        int activeSales = (int) sales.stream().filter(Sale::isActive).count();
        int inactiveSales = totalSales - activeSales;

        BigDecimal totalRevenue = sales.stream()
                .filter(s -> s.getTotalAmount() != null)
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageSale = totalSales > 0 ?
                totalRevenue.divide(BigDecimal.valueOf(totalSales), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        Map<String, Long> paymentMethodCount = sales.stream()
                .filter(s -> s.getPaymentMethod() != null)
                .collect(Collectors.groupingBy(Sale::getPaymentMethod, Collectors.counting()));

        String mostCommonPayment = paymentMethodCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        PdfPTable statsTable = new PdfPTable(3);
        statsTable.setWidthPercentage(100);
        statsTable.setSpacingAfter(20);

        statsTable.addCell(createStatsCell("RESUMEN DE VENTAS",
                "Total de ventas: " + totalSales + "\n" +
                        "Ventas activas: " + activeSales + "\n" +
                        "Ventas inactivas: " + inactiveSales,
                new Color(240, 248, 255)));

        statsTable.addCell(createStatsCell("INGRESOS",
                "Total: $" + currencyFormat.format(totalRevenue) + "\n" +
                        "Promedio: $" + currencyFormat.format(averageSale),
                new Color(240, 255, 240)));

        statsTable.addCell(createStatsCell("MÉTODOS DE PAGO",
                "Diferentes métodos: " + paymentMethodCount.size() + "\n" +
                        "Más común: " + mostCommonPayment,
                new Color(255, 248, 240)));

        document.add(statsTable);
    }

    private PdfPCell createStatsCell(String title, String content, Color bgColor) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(10);
        cell.setBackgroundColor(bgColor);

        Paragraph p = new Paragraph();
        p.add(new Phrase(title + "\n", HEADER_FONT));
        p.add(new Phrase(content, NORMAL_FONT));

        cell.addElement(p);
        return cell;
    }

    private void addFooterTotals(Document document, List<Sale> sales) throws DocumentException {
        BigDecimal totalRevenue = sales.stream()
                .filter(s -> s.getTotalAmount() != null)
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

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

    private void addFiltersInfo(Document document, Map<String, Object> filters) throws DocumentException {
        Paragraph filtersTitle = new Paragraph("Filtros aplicados:", BOLD_FONT);
        filtersTitle.setSpacingAfter(5);
        document.add(filtersTitle);

        com.lowagie.text.List filtersList = new com.lowagie.text.List(false, 10);
        filtersList.setListSymbol(new Chunk("• ", FontFactory.getFont(FontFactory.HELVETICA, 12)));

        filters.forEach((key, value) -> {
            if (value != null && !value.toString().isEmpty()) {
                String filterText = formatFilterText(key, value.toString());
                filtersList.add(new ListItem(filterText, SMALL_FONT));
            }
        });

        if (!filtersList.isEmpty()) {
            document.add(filtersList);
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

    public byte[] generateSaleReport(Sale sale) {
        try {
            List<Sale> sales = List.of(sale); // Convertir a lista para reutilizar el método
            return generateCustomSalesReport(sales, "DETALLE DE VENTA", null);
        } catch (Exception e) {
            throw new RuntimeException("Error generando reporte de venta: " + e.getMessage(), e);
        }
    }
}
