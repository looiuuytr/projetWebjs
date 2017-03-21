$(document).ready(function(){
  $(function(){
    $("#commune").autocomplete( { minLength: 1},
      { select: function( event, ui ) {
        $("#listeCommunes").append(ui.item.value);
      }},
      { source: function( request, response ) {
        $.ajax({
          url : 'http://infoweb-ens/~jacquin-c/codePostal/commune.php?',
          type : 'GET',
          dataType : 'json',
          data : 'commune='+$("#commune").val()+"&maxRows=10",
          success: function(data) {
            response(function(){
              var tableau=[];
              for (objet of data) {
                tableau.append(objet["Ville"]);
                $("#test").append("<li>"+objet["Ville"]+"</li>");
              }
              return tableau;
            });
          },
          error: function(data) {
          }
        });
      }
    });
  });
});
