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
    tableau.clear();
    var counter = 1;

    $.ajax({
        url:'http://api.flickr.com/services/feeds/photos_public.gne',
        type:'GET',
        dataType:'jsonp',
        jsonp: 'jsoncallback', // a renseigner d'après la doc du service, par défaut callback
        data:'tags='+$("#commune").val()+'&tagmode=any&format=json',
        success:function(data){
            var compteur = 0;
            $.each(data.items, function(i,item){
                        var image = $("<img/>").attr("src", item.media.m);
                        var modal = $("<div/>").css("display", "none");
                        var date = item.published.split("T")[0].split("-");
                        var heure = item.published.split("T")[1].split(":");
                        var publication = date[2]+"/"+date[1]+"/"+date[0]+" à "+heure[0]+":"+heure[1];
                        var infos = "<div>" +'<img src="'+item.media.m+'"/>'+'<div>'+item.title+publication+item.author.match("\"(.*)\"")[1]+'</div></div>';
                        modal.html(infos);

                        image.click(add_event);
                        function add_event() {
                          modal.dialog({
                            dialogClass: "alert",
                            modal:"true"
                          });
                          modal.css( "display", "block" );
                        }

                        image.appendTo("#images");
                        modal.appendTo("#images");



                        tableau.row.add( [
                            '<img src="'+item.media.m+'"/>'  ,
                            item.title,
                            publication,
                            item.author.match("\"(.*)\"")[1]
                        ] ).draw( false );

                        if ( i == $("#nbphotos") ){

                          return false ;
                        }
                        compteur=i;
            });
            if (compteur==0){
              $( ".modal" ).dialog({
                dialogClass: "alert"
              });
              $( ".modal" ).css( "display", "block" );
            }
            else{
              $( ".modal" ).css( "display", "none" );
            }


        },
        error: function(resultat,statut,erreur){
        console.log("erreur");},
         });
});

});
