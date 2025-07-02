package com.Scrum3.ArcadeStore.services;

import com.Scrum3.ArcadeStore.Repository.SaleRepository;
import com.Scrum3.ArcadeStore.dto.SaleFilterDTO;
import com.Scrum3.ArcadeStore.entities.Sale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

@Service
public class SaleServiceImpl extends SaleService {

    @Autowired
    private final SaleRepository saleRepository;

    @Autowired
    private final PdfReportService pdfReportService;

    public SaleServiceImpl(SaleRepository saleRepository, PdfReportService pdfReportService) {
        this.saleRepository = saleRepository;
        this.pdfReportService = pdfReportService;
    }
    public byte[] generateSalesReportWithFilters(SaleFilterDTO filters) throws Exception {
        Specification<Sale> spec = Specification.where(null);

        if (filters.getStartDate() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("saleDate"), filters.getStartDate().atStartOfDay()));
        }

        if (filters.getEndDate() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("saleDate"), filters.getEndDate().atTime(23, 59, 59)));
        }

        if (filters.getUserId() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("user").get("id"), filters.getUserId()));
        }

        if (filters.getGameId() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("game").get("id"), filters.getGameId()));
        }

        if (filters.getActive() != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("active"), filters.getActive()));
        }

        List<Sale> filteredSales =  saleRepository.findAll(spec);

        return pdfReportService.generateSaleReport((Sale) filteredSales);
    }

}
