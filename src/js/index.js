$(document).ready(function(){
  $("#commune").autocomplete({
      source : function(requete, response){
      $.ajax({
              url : 'http://infoweb-ens/~jacquin-c/codePostal/commune.php', // on appelle le script JSON
              type: 'GET',
              dataType : 'json', // on spécifie bien que le type de données est en JSON
              data : 'commune='+$("#commune").val()+"&maxRows=10",
              success: function (data){
              	response($.map(data, function (item){
              		return {
              			label: item.Ville,
                    value: item.Ville
              		}
              	}));
              }
          });//fin ajax
      }
  });

  $( function() {
    $( "#tabs" ).tabs();
  });
  $('button[type=submit]').button({icons: {primary: 'ui-icon-circle-zoomin'}}).click(function (event) {
  event.preventDefault();
  });

  var tableau = $('#myTable').DataTable();

  $("#rechercher").on('click',  function(event){
    $("#images").empty();
    var counter = 1;
    console.log($("#commune").val());
    $.ajax({
        url:'http://api.flickr.com/services/feeds/photos_public.gne',
        type:'GET',
        dataType:'jsonp',
        jsonp: 'jsoncallback', // a renseigner d'après la doc du service, par défaut callback
        data:'tags='+$("#commune").val()+'&tagmode=any&format=json',
        success:function(data){

            $.each(data.items, function(i,item){
                        var image = $("<img/>").attr("src", item.media.m);
                        image.appendTo("#images");
                        
                        $("<br/>").appendTo("#images");
                        tableau.row.add( [
                            '<img src="'+item.media.m+'"/>'  ,
                             '.2',
                             '.3',
                             '.4'
                        ] ).draw( false );

                        if ( i == $("#nbphotos") ){

                          return false ;
                        }
            });

        },
        error: function(resultat,statut,erreur){
        console.log("erreur");},
         });
});

});
