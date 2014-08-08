'use strict';

(function(window, $, undefined) {

  var DEBUG, log, init, renderInteractionTable;

  DEBUG = true;
  log = function log( message ) {
    if ( DEBUG ) {
      console.log( message );
    }
  };

  init = function init() {
      log( 'Initializing app...' );
  };

  //draw interactions table
  renderInteractionTable = function renderInteractionTable(url, gene) {
    $('#ebi_iv_itable').empty();

    var myUrl = url;
    if (url.substr(-1) === '/') {
      myUrl = url.replace(/\/$/, '');
    }

    var iTable = new Biojs.InteractionsTable({
      target: 'ebi_iv_itable',
      dataSet: {
        dataType: 'text',
        psicquicUrl: myUrl,
        query: gene,
        version: 'MITAB_VERSION_2_5',
        filter: false
      },
      rowSelection: true
    });

    $('#ebi_iv_itable').removeClass('hidden');
  };

  /* go! */
  if (! $('#ebi_iv').hasClass('ebi-iv-processed') ) {
    // prevent duplicate initialization
    $('#ebi_iv').addClass('ebi-iv-processed');

    init();

    $('#ebi_iv_gene_form_reset').on('click', function() {
      $('#ebi_iv_itable').empty();
      $('#ebi_iv_itable').addClass('hidden');
      $('#ebi_iv_gene').val('');
      $('.result').empty();
    });

    $( 'form[name=ebi_iv_gene_form]' ).on( 'submit', function( e ) {
      e.preventDefault();

      var url = 'https://api.araport.org/data/EBI_IntAct/alpha/';

      $('.result').empty();
      var gene = $('#ebi_iv_gene').val();
      //did the user enter the name of a gene?
      if (gene.length > 0) {
          renderInteractionTable(url, gene);
      } else {
        window.alert('You must enter a gene first.');
      }
    }); /// end gene submit function
  }

})(window, jQuery);

