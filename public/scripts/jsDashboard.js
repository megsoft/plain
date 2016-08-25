
$(document).ready(function () {
    $('.modal ').insertAfter($('body'));
    debugger;
    $("#fgrdData").flexigrid({
        type: "GET",
        dataType: 'json',
    url: "../Dashboard",
        colModel: [{
                display: 'No',
                name: 'slno',
                width: 50,
                sortable: true,
                align: 'left'
            }, {
                display: 'Agent',
                name:'Agent',
                width: 150,
                sortable: true,
                align: 'left'
            }, {
                display: 'Sub Agent',
                name: 'SubAgent',
                width: 150,
                sortable: true,
                align: 'left'
            }, {
                display: 'Client',
                name: 'Client',
                width: 150,
                sortable: true,
                align: 'left'
            }, {
                display: 'CompanyName',
                name: 'CompanyName',
                width: 200,
                sortable: true,
                align: 'left'
            }, {
                display: 'Number',
                name: 'Number',
                width: 80,
                sortable: true,
                align: 'left'
            },
            {
                display: 'Amount',
                name: 'Amount',
                width: 100,
                sortable: true,
                align: 'left'
            }, {
                display: 'Application Date',
                name: 'ApplicationDate',
                width: 100,
                sortable: true,
                align: 'left'
            }, {
                display: 'LC Status',
                name: 'LCStatus',
                width: 85,
                sortable: true,
                align: 'left'
            },
          
        ], 
        buttons: [
            { name: 'download', bclass: 'download', onpress: downloadclicked }
        ],
       
        
        searchitems: [{
                display: 'Name',
                name: 'tbl.FirstName',
                isdefault: true
            },
            {
                display: 'Company Name',
                name: 'tbl.CompanyLegalName'
            }
        ],
        sortname: "Id",
        sortorder: "asc",
        usepager: true,
        
        useRp: true,
        rp: parseInt(($(window).height() - 380) / 26),
        showTableToggleBtn: true,
        
        height: $(window).height() - 380,
    
    });

   
});


function downloadclicked(com, grid) {
    var w = window.open('reports\\LOCDetails.html');
    w.location = "reports\\LOCDetails.pdf";

}