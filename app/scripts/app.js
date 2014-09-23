/*globals Biojs*/
(function(window, $, Biojs, undefined) {
  'use strict';

  console.log('Hello, InteractionTableApp!');

  var appContext = $('[data-app-name="interactiontableapp"]');

  /* Generate Agave API docs */
  window.addEventListener('Agave::ready', function() {
    var Agave, help, helpItem, helpDetail, methods, methodDetail;

    Agave = window.Agave;

    appContext.html('<h2>Hello AIP Science App &plus; Agave API!</h2><div class="api-help list-group"></div><hr><div class="api-info"></div><br>');

    help = $('.api-help', appContext);

    $.each(Agave.api.apisArray, function(i, api) {
      helpItem = $('<a class="list-group-item">');
      help.append(helpItem);

      helpItem.append($('<h4>').text(api.name).append('<i class="pull-right fa fa-toggle-up"></i>'));
      helpDetail = $('<div class="api-help-detail">');
      helpDetail.append($('<p>').text(api.description));
      helpDetail.append('<h5>Methods</h5>');
      methods = $('<ul>');
      $.each(api.help(), function(i, m) {
        methodDetail = $('<li>');
        methodDetail.append('<strong>' + m + '</strong>');
        var details = api[m.trim()].help();
        if (details) {
          methodDetail.append('<br>').append('Parameters');
          methodDetail.append('<p style="white-space:pre-line;">' + details + '</p>');
        }
        methods.append(methodDetail);
      });
      helpDetail.append(methods);
      helpItem.append(helpDetail.hide());
    });

    $('.api-help > a', appContext).on('click', function() {
      if (! $(this).hasClass('list-group-item-info')) {
        // close other
        $('.api-help > a.list-group-item-info', appContext).removeClass('list-group-item-info').find('.fa').toggleClass('fa-toggle-up fa-toggle-down').end().find('.api-help-detail').slideToggle();
      }

      $(this).toggleClass('list-group-item-info');
      $('.fa', this).toggleClass('fa-toggle-up fa-toggle-down');
      $('.api-help-detail', this).slideToggle();
    });

    var info = $('.api-info', appContext);
    info.addClass('text-center');
    info.append('<p>' + Agave.api.info.title + ': ' + Agave.api.info.description + '</p>');
    info.append('<p><a href="mailto:' + Agave.api.info.contact + '">Contact</a> | <a href="' + Agave.api.info.license + '">License</a> | <a href="' + Agave.api.info.license + '">Terms of use</a></p>');
  });

  var DEBUG, log, init, renderInteractionTable;

  DEBUG = false;
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

    new Biojs.InteractionsTable({
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

})(window, jQuery, Biojs);
