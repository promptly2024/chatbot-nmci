export const API_REGISTRY = [
    {
        // Prompt : Generates Sales Invoice Register (Item-wise) report with detailed invoice and item information for last 180 days and creation date is also last 180 days 
        "name": "generateSalesInvoiceRegister",
        "description": "Generates Sales Invoice Register (Item-wise) report with detailed invoice and item information",
        "method": "POST",
        "endpoint": "/generate_report",
        "queryParams": [],
        "pathParams": [],
        "body": {
            "selected_columns": {
                "type": "array",
                "example": [],
                "description": "Array of column identifiers to include in the report"
            },
            "grouped_data": {
                "type": "boolean",
                "example": true,
                "description": "Whether to group the data in the response"
            },
            "selected_group_columns": {
                "type": "array",
                "example": [],
                "description": "Array of column identifiers to group by"
            },
            "initial_request": {
                "type": "boolean",
                "example": true,
                "description": "Flag indicating if this is the initial request"
            },
            "numeric_search_prefixes": {
                "type": "object",
                "example": {},
                "description": "Object containing numeric search prefixes for filtering"
            },
            "report": {
                "type": "object",
                "example": {
                    "id": "29"
                },
                "description": "Report configuration object with report ID"
            },
            "search": {
                "type": "object",
                "example": {},
                "description": "Search parameters object"
            },
            "pagination": {
                "type": "object",
                "example": {
                    "group_by": [],
                    "group_desc": [],
                    "items_per_page": 50,
                    "multi_sort": false,
                    "must_sort": false,
                    "page": 1,
                    "sort_by": [],
                    "sort_desc": []
                },
                "description": "Pagination and sorting configuration"
            },
            "invoice_date_interval|invoice_from_date|invoice_to_date": {
                "type": "string",
                // required: true, Can not be empty string 
                "example": "Last 180 Days",
                "description": "Invoice date filter interval",
                "options": [
                    "Last 180 Days",
                    "All",
                    "Custom"
                ]
            },
            "creation_date_interval|creation_start_date|creation_end_date": {
                "type": "string",
                // required: true, Can not be empty string // default All
                "example": "Last 180 Days",
                "description": "Creation date filter interval",
                "options": [
                    "Last 180 Days",
                    "All",
                    "Custom"
                ]
            },
            "payment_due_date_interval|payment_start_date|payment_end_date": {
                "type": "string",
                // required: true, Can not be empty string
                "example": "All",
                "description": "Payment due date filter interval"
            },
            "dispatch_details_status": {
                "type": "string",
                // required: true,
                "example": "All",
                "description": "Filter by dispatch details status"
            },
            "company_buyer": {
                "type": "string",
                "example": "",
                "description": "Company buyer filter (empty string for all)"
            },
            "tag_sales": {
                "type": "string",
                "example": "",
                "description": "Sales tag filter (empty string for all)"
            },
            "item_id": {
                "type": "string",
                "example": "",
                "description": "Specific item ID filter (empty string for all)"
            },
            "currency_type": {
                "type": "string",
                // required: true,
                "example": "Rupee",
                "description": "Currency type filter",
                "options": [
                    "Rupee",
                    "Rupee Export",
                    "US Dollar",
                    "Pound",
                    "Euro",
                    "Yen",
                    "Rest",
                    "All"
                ]
            },
            "document_status": {
                "type": "string",
                "example": "All Sent",
                // required: true,
                "description": "Document status filter",
                "options": [
                    "All",
                    "Draft",
                    "Cancelled",
                    "All Sent"
                ]
            },
            "invoice_payment_status": {
                "type": "string",
                "example": "All",
                // required: true,
                "description": "Invoice payment status filter",
                "options": [
                    "Fully Paid",
                    "Pending",
                    "Overdue",
                    "All"
                ]
            },
            "output": {
                "type": "string",
                // required: true,
                "example": "display",
                "description": "Output format type",
                "options": [
                    "display",
                    "download",
                    "email"
                ]
            }
        },
        "headers": [
            "Content-Type"
        ]
    },
    {
        // Prompt: "Generates Product Price and Inventory report with pricing details and stock information for product type sell"
        "name": "generateProductPriceAndInventoryReport",
        "description": "Generates Product Price and Inventory report with pricing details and stock information",
        "method": "POST",
        "endpoint": "/generate_report",
        "queryParams": [],
        "pathParams": [],
        "body": {
            "selected_columns": {
                "type": "array",
                "example": [],
                "description": "Array of column identifiers to include in the report"
            },
            "grouped_data": {
                "type": "boolean",
                "example": false,
                "description": "Whether to group the data in the response"
            },
            "selected_group_columns": {
                "type": "array",
                "example": [],
                "description": "Array of column identifiers to group by"
            },
            "initial_request": {
                "type": "boolean",
                "example": true,
                "description": "Flag indicating if this is the initial request"
            },
            "numeric_search_prefixes": {
                "type": "object",
                "example": {},
                "description": "Object containing numeric search prefixes for filtering"
            },
            "report": {
                "type": "object",
                "example": {
                    "id": "9",
                },
                "description": "Report configuration object with report ID for Product Price and Inventory"
            },
            "search": {
                "type": "object",
                "example": {},
                "description": "Search parameters object"
            },
            "pagination": {
                "type": "object",
                "example": {
                    "group_by": [],
                    "group_desc": [],
                    "items_per_page": 50,
                    "multi_sort": false,
                    "must_sort": false,
                    "page": 1,
                    "sort_by": [],
                    "sort_desc": []
                },
                "description": "Pagination and sorting configuration"
            },
            "product_type": {
                "type": "string",
                "example": "All",
                "description": "Filter by product type",
                "options": [
                    "All",
                    "Buy",
                    "Sell"
                ]
            },
            "inventory_date": {
                "type": "string",
                "example": "",
                "description": "Specific inventory date filter (empty string for current date)"
            },
            "tag_purchase_reject": {
                "type": "string",
                "example": "",
                "description": "Purchase rejection tag filter (empty string for all)"
            },
            "product_category": {
                "type": "string",
                "example": "",
                "description": "Product category filter (empty string for all categories)"
            },
            "pricing_type": {
                "type": "string",
                "example": "Default Price",
                "description": "Pricing type filter",
                "options": [
                    "Default Price",
                    "Average Pricing",
                    "FIFO"
                ]
            },
            "stock_check": {
                "type": "string",
                "example": "All (Default)",
                "description": "Stock check filter for inventory status",
                "options": [
                    "All (Default)",
                    "Less than Min Stock Level",
                    "Greater than Max Stock Level",
                    "Greater than Max or Less than Min Stock Level"
                ]
            },
            "output": {
                "type": "string",
                "example": "display",
                "description": "Output format type",
                "options": [
                    "display",
                    "download",
                    "email"
                ]
            }
        },
        "headers": [
            "Content-Type"
        ]
    },
    {   
        // Prompt: "Generates Sales Order Register (Item-wise) report with detailed order and item information the creation date is last 30 days and the delivery date is also last 30 days"
        "name": "generateSalesOrderRegisterItemwise",
        "description": "Generates Sales Order Register (Item-wise) report with detailed order and item information",
        "method": "POST",
        "endpoint": "/generate_report",
        "queryParams": [],
        "pathParams": [],
        "body": {
            "selected_columns": {
                "type": "array",
                "example": [],
                "description": "Array of column identifiers to include in the report"
            },
            "grouped_data": {
                "type": "boolean",
                "example": false,
                "description": "Whether to group the data in the response"
            },
            "selected_group_columns": {
                "type": "array",
                "example": [],
                "description": "Array of column identifiers to group by"
            },
            "initial_request": {
                "type": "boolean",
                "example": true,
                "description": "Flag indicating if this is the initial request"
            },
            "numeric_search_prefixes": {
                "type": "object",
                "example": {},
                "description": "Object containing numeric search prefixes for filtering"
            },
            "report": {
                "type": "object",
                "example": {
                    "id": "2"
                },
                "description": "Report configuration object with report ID for Sales Order Register (Item-wise)"
            },
            "search": {
                "type": "object",
                "example": {},
                "description": "Search parameters object"
            },
            "pagination": {
                "type": "object",
                "example": {
                    "group_by": [],
                    "group_desc": [],
                    "items_per_page": 50,
                    "multi_sort": false,
                    "must_sort": false,
                    "page": 1,
                    "sort_by": [],
                    "sort_desc": []
                },
                "description": "Pagination and sorting configuration"
            },
            "creation_date_interval|creation_start_date|creation_end_date": {
                "type": "string",
                "example": "Last 180 Days",
                "description": "Creation date filter interval for sales orders",
                "options": [
                    "Last 180 Days",
                    "All",
                    "Custom"
                ]
            },
            "delivery_date_interval|delivery_start_date|delivery_end_date": {
                "type": "string",
                "example": "All",
                "description": "Delivery date filter interval for sales orders",
                "options": [
                    "All",
                    "Last 30 Days",
                    "Last 90 Days",
                    "Custom"
                ]
            },
            "company_buyer": {
                "type": "string",
                "example": "",
                "description": "Company buyer filter (empty string for all buyers)"
            },
            "tag_sales": {
                "type": "string",
                "example": "",
                "description": "Sales tag filter (empty string for all tags)"
            },
            "item_id": {
                "type": "string",
                "example": "",
                "description": "Specific item ID filter (empty string for all items)"
            },
            "currency_type": {
                "type": "string",
                "example": "Rupee",
                "description": "Currency type filter",
                "options": [
                    "Rupee",  
                    "Rupee Export",  
                    "US Dollar",  
                    "Pound",  
                    "Euro",  
                    "Yen",  
                    "Rest",  
                    "All"
                ]
            },
            "item_type": {
                "type": "string",
                "example": "Goods",
                "description": "Item type filter",
                "options": [
                    "Goods",
                    "Service",
                    "All"
                ]
            },
            "invoice_status": {
                "type": "string",
                "example": "Overdue",
                "description": "Invoice status filter for sales orders",
                "options": [
                    "Overdue",
                    "Pending",
                    "Completed",
                    "All"
                ]
            },
            "document_status": {
                "type": "string",
                "example": "All Sent",
                "description": "Document status filter",
                "options": [
                    "All Sent",
                    "Draft",
                    "Cancelled",
                    "All Sent"
                ]
            },
            "show_alternate_uom": {
                "type": "string",
                "example": "No",
                "description": "Whether to show alternate Unit of Measurement",
                "options": [
                    "Yes",
                    "No"
                ]
            },
            "output": {
                "type": "string",
                "example": "display",
                "description": "Output format type",
                "options": [
                    "display",
                    "download",
                    "email"
                ]
            }
        },
        "headers": [
            "Content-Type"
        ]
    },
    {
        // Prompt: "Generates Purchase Invoice Register (Item-wise) report with detailed purchase invoice and item information for last 30 days"
        "name": "generatePurchaseInvoiceRegisterItemwise",
        "description": "Generates Purchase Invoice Register (Item-wise) report with detailed purchase invoice and item information",
        "method": "POST",
        "endpoint": "/generate_report",
        "queryParams": [],
        "pathParams": [],
        "body": {
            "selected_columns": {
                "type": "array",
                "example": [],
                "description": "Array of column identifiers to include in the report"
            },
            "grouped_data": {
                "type": "boolean",
                "example": false,
                "description": "Whether to group the data in the response"
            },
            "selected_group_columns": {
                "type": "array",
                "example": [],
                "description": "Array of column identifiers to group by"
            },
            "initial_request": {
                "type": "boolean",
                "example": true,
                "description": "Flag indicating if this is the initial request"
            },
            "numeric_search_prefixes": {
                "type": "object",
                "example": {},
                "description": "Object containing numeric search prefixes for filtering"
            },
            "report": {
                "type": "object",
                "example": {
                    "id": "77"
                },
                "description": "Report configuration object with report ID for Purchase Invoice Register (Item-wise)"
            },
            "search": {
                "type": "object",
                "example": {},
                "description": "Search parameters object"
            },
            "pagination": {
                "type": "object",
                "example": {
                    "group_by": [],
                    "group_desc": [],
                    "items_per_page": 50,
                    "multi_sort": false,
                    "must_sort": false,
                    "page": 1,
                    "sort_by": [],
                    "sort_desc": []
                },
                "description": "Pagination and sorting configuration"
            },
            "creation_date_interval|creation_start_date|creation_end_date": {
                "type": "string",
                "example": "Last 180 Days",
                "description": "Creation date filter interval for purchase invoices",
                "options": [
                    "Last 180 Days",
                    "All",
                    "Custom"
                ]
            },
            "payment_due_date_interval|payment_start_date|payment_end_date": {
                "type": "string",
                "example": "All",
                "description": "Payment due date filter interval for purchase invoices",
                "options": [
                    "All",
                    "Last 30 Days",
                    "Last 90 Days",
                    "Custom"
                ]
            },
            "invoice_date_interval|document_start_date|document_end_date": {
                "type": "string",
                "example": "Last 180 Days",
                "description": "Invoice date filter interval for purchase invoices",
                "options": [
                    "Last 180 Days",
                    "All",
                    "Custom"
                ]
            },
            "currency_type": {
                "type": "string",
                "example": "Rupee",
                "description": "Currency type filter",
                "options": [
                    "Rupee",  
                    "Rupee Export",  
                    "US Dollar",  
                    "Pound",  
                    "Euro",  
                    "Yen",  
                    "Rest",  
                    "All"
                ]
            },
            "invoice_payment_status": {
                "type": "string",
                "example": "All",
                "description": "Invoice payment status filter",
                "options": [
                    "All",
                    "Pending",
                    "Fully Paid",
                    "Overdue"
                ]
            },
            "document_status": {
                "type": "string",
                "example": "All Sent",
                "description": "Document status filter",
                "options": [
                    "All Sent",
                    "Draft",
                    "Cancelled",
                    "All"
                ]
            },
            "company_buyer": {
                "type": "string",
                "example": "",
                "description": "Company buyer filter (empty string for all buyers)"
            },
            "output": {
                "type": "string",
                "example": "display",
                "description": "Output format type",
                "options": [
                    "display",
                    "download",
                    "email"
                ]
            }
        },
        "headers": [
            "Content-Type"
        ]
    },
    {
        // Prompt: "Generates Inventory Movement/Batch Tracking report with detailed product movement, barcode, and batch information for last 30 days"
        "name": "generateInventoryMovementBatchReport",
        "description": "Generates Inventory Movement/Batch Tracking report with detailed product movement, barcode, and batch information",
        "method": "POST",
        "endpoint": "/generate_report",
        "queryParams": [],
        "pathParams": [],
        "body": {
            "selected_columns": {
                "type": "array",
                "example": [],
                "description": "Array of column identifiers to include in the report"
            },
            "grouped_data": {
                "type": "boolean",
                "example": false,
                "description": "Whether to group the data in the response"
            },
            "selected_group_columns": {
                "type": "array",
                "example": [],
                "description": "Array of column identifiers to group by"
            },
            "initial_request": {
                "type": "boolean",
                "example": true,
                "description": "Flag indicating if this is the initial request"
            },
            "numeric_search_prefixes": {
                "type": "object",
                "example": {},
                "description": "Object containing numeric search prefixes for filtering"
            },
            "report": {
                "type": "object",
                "example": {
                    "id": "88",
                    "download_type": 0
                },
                "description": "Report configuration object with report ID for Inventory Movement/Batch Tracking and download type"
            },
            "search": {
                "type": "object",
                "example": {},
                "description": "Search parameters object"
            },
            "pagination": {
                "type": "object",
                "example": {
                    "group_by": [],
                    "group_desc": [],
                    "items_per_page": 50,
                    "multi_sort": false,
                    "must_sort": false,
                    "page": 1,
                    "sort_by": [],
                    "sort_desc": []
                },
                "description": "Pagination and sorting configuration"
            },
            "creation_date_interval|creation_start_date|creation_end_date": {
                "type": "string",
                "example": "Last 180 Days",
                "description": "Creation date filter interval for inventory movements",
                "options": [
                    "Last 180 Days",
                    "All",
                    "Custom"
                ]
            },
            "item_id": {
                "type": "string",
                "example": "",
                "description": "Specific item ID filter (empty string for all items)"
            },
            "barcode_number_text": {
                "type": "string",
                "example": "BAR001",
                "description": "Barcode number filter for specific product tracking"
            },
            "document_number_text": {
                "type": "string",
                "example": "INV001",
                "description": "Document number filter (invoice/transaction number)"
            },
            "expiry_date_interval|expiration_start_date|expiration_end_date": {
                "type": "string",
                "example": "All",
                "description": "Expiry date filter interval for batch tracking",
                "options": [
                    "All",
                    "Expired",
                    "Expiring Soon",
                    "Custom"
                ]
            },
            "product_category": {
                "type": "string",
                "example": "",
                "description": "Product category filter (empty string for all categories)"
            },
            "movement_type": {
                "type": "string",
                "example": "Both",
                "description": "Type of inventory movement to track",
                "options": [
                    "Both",
                    "Inward",
                    "Outward",
                    "Transfer"
                ]
            },
            "manufacturing_date_interval|manufacturing_start_date|manufacturing_end_date": {
                "type": "string",
                "example": "All",
                "description": "Manufacturing date filter interval for batch tracking",
                "options": [
                    "All",
                    "Last 30 Days",
                    "Last 90 Days",
                    "Custom"
                ]
            },
            "output": {
                "type": "string",
                "example": "display",
                "description": "Output format type",
                "options": [
                    "display",
                    "download",
                    "email"
                ]
            }
        },
        "headers": [
            "Content-Type"
        ]
    },
    {
        // Prompt: "Generates Sales Quotation (Item-wise) report with detailed quotation and item information for sales prospects for last 30 days, the reply date is last 30 days and next action is all"
        "name": "generateSalesQuotationItemwise",
        "description": "Generates Sales Quotation (Item-wise) report with detailed quotation and item information for sales prospects",
        "method": "POST",
        "endpoint": "/generate_report",
        "queryParams": [],
        "pathParams": [],
        "body": {
            "selected_columns": {
                "type": "array",
                "example": [],
                "description": "Array of column identifiers to include in the report"
            },
            "grouped_data": {
                "type": "boolean",
                "example": false,
                "description": "Whether to group the data in the response"
            },
            "selected_group_columns": {
                "type": "array",
                "example": [],
                "description": "Array of column identifiers to group by"
            },
            "initial_request": {
                "type": "boolean",
                "example": true,
                "description": "Flag indicating if this is the initial request"
            },
            "numeric_search_prefixes": {
                "type": "object",
                "example": {},
                "description": "Object containing numeric search prefixes for filtering"
            },
            "report": {
                "type": "object",
                "example": {
                    "id": "8"
                },
                "description": "Report configuration object with report ID for Sales Quotation (Item-wise)"
            },
            "search": {
                "type": "object",
                "example": {},
                "description": "Search parameters object"
            },
            "pagination": {
                "type": "object",
                "example": {
                    "group_by": [],
                    "group_desc": [],
                    "items_per_page": 50,
                    "multi_sort": false,
                    "must_sort": false,
                    "page": 1,
                    "sort_by": [],
                    "sort_desc": []
                },
                "description": "Pagination and sorting configuration"
            },
            "conversion_type": {
                "type": "string",
                "example": "Pending",
                "description": "Status of quotation conversion to sales order",
                "options": [
                    "Pending",
                    "Converted",
                    "All",
                    "Expired"
                ]
            },
            "sq_type": {
                "type": "string",
                "example": "All Sent",
                "description": "Sales quotation document status filter",
                "options": [
                    "All Sent",
                    "Draft",
                    "Cancelled",
                    "All"
                ]
            },
            "enquiry_date_interval|enquiry_start_date|enquiry_end_date": {
                "type": "string",
                "example": "All",
                "description": "Enquiry date filter interval for quotation requests",
                "options": [
                    "All",
                    "Last 30 Days",
                    "Last 90 Days",
                    "Custom"
                ]
            },
            "reply_date_interval|reply_start_date|reply_end_date": {
                "type": "string",
                "example": "All",
                "description": "Reply date filter interval for quotation responses",
                "options": [
                    "All",
                    "Last 30 Days",
                    "Last 90 Days",
                    "Custom"
                ]
            },
            "next_action_date_interval|next_action_start_date|next_action_end_date": {
                "type": "string",
                "example": "All",
                "description": "Next action date filter interval for follow-up activities",
                "options": [
                    "All",
                    "Due Today",
                    "Overdue",
                    "Custom"
                ]
            },
            "company_buyer": {
                "type": "string",
                "example": "",
                "description": "Company buyer filter (empty string for all buyers)"
            },
            "currency_type": {
                "type": "string",
                "example": "Rupee",
                "description": "Currency type filter",
                "options": [
                    "Rupee",
                    "Dollar",
                    "Euro"
                ]
            },
            "output": {
                "type": "string",
                "example": "display",
                "description": "Output format type",
                "options": [
                    "display",
                    "download",
                    "email"
                ]
            }
        },
        "headers": [
            "Content-Type"
        ]
    },
    {
        // Prompt: "Generates Account Receivable report with detailed invoice data, payment status, and outstanding balances for last 7 days"
        "name": "generateAccountReceivableReport",
        "description": "Generates Account Receivable report with detailed invoice data, payment status, and outstanding balances",
        "method": "POST",
        "endpoint": "/generate_report",
        "queryParams": [],
        "pathParams": [],
        "body": {
            "selected_columns": {
                "type": "array",
                "example": [],
                "description": "Array of column identifiers to include in the report"
            },
            "grouped_data": {
                "type": "boolean",
                "example": false,
                "description": "Whether to group the data in the response"
            },
            "selected_group_columns": {
                "type": "array",
                "example": [],
                "description": "Array of column identifiers to group by"
            },
            "initial_request": {
                "type": "boolean",
                "example": true,
                "description": "Flag indicating if this is the initial request"
            },
            "numeric_search_prefixes": {
                "type": "object",
                "example": {},
                "description": "Object containing numeric search prefixes for filtering"
            },
            "report": {
                "type": "object",
                "example": {
                    "id": "102"
                },
                "description": "Report configuration object with report ID for Account Receivable"
            },
            "search": {
                "type": "object",
                "example": {},
                "description": "Search parameters object"
            },
            "pagination": {
                "type": "object",
                "example": {
                    "group_by": [],
                    "group_desc": [],
                    "items_per_page": 50,
                    "multi_sort": false,
                    "must_sort": false,
                    "page": 1,
                    "sort_by": [],
                    "sort_desc": []
                },
                "description": "Pagination and sorting configuration"
            },
            "document_date_interval|document_start_date|document_end_date": {
                "type": "string",
                "example": "All",
                "description": "Document date filter interval for account receivable records",
                "options": [
                    "All",
                    "Last 7 Days",
                    "Last 30 Days",
                    "Last 180 Days",
                    "Custom"
                ]
            },
            "payment_date_interval|payment_start_date|payment_end_date": {
                "type": "string",
                "example": "All",
                "description": "Payment date filter interval for account receivable records",
                "options": [
                    "All",
                    "Last 7 Days",
                    "Last 30 Days",
                    "Last 180 Days",
                    "Custom"
                ]
            },
            "company_all": {
                "type": "string",
                "example": "",
                "description": "Company filter (empty string for all companies)"
            },
            "tds_others": {
                "type": "string",
                "example": "Yes",
                "description": "Include TDS (Tax Deducted at Source) and other deductions in the report",
                "options": [
                    "Yes",
                    "No"
                ]
            },
            "output": {
                "type": "string",
                "example": "display",
                "description": "Output format type",
                "options": [
                    "display",
                    "download",
                    "email"
                ]
            }
        },
        "headers": [
            "Content-Type"
        ]
    }
]