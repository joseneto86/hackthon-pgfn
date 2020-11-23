$(function () {
    /* jQueryKnob */

    $('.knob').knob({
      /*change : function (value) {
       //console.log("change : " + value);
       },
       release : function (value) {
       console.log("release : " + value);
       },
       cancel : function () {
       console.log("cancel : " + this.value);
       },*/
      draw: function () {

        // "tron" case
        if (this.$.data('skin') == 'tron') {

          var a   = this.angle(this.cv)  // Angle
            ,
              sa  = this.startAngle          // Previous start angle
            ,
              sat = this.startAngle         // Start angle
            ,
              ea                            // Previous end angle
            ,
              eat = sat + a                 // End angle
            ,
              r   = true

          this.g.lineWidth = this.lineWidth

          this.o.cursor
          && (sat = eat - 0.3)
          && (eat = eat + 0.3)

          if (this.o.displayPrevious) {
            ea = this.startAngle + this.angle(this.value)
            this.o.cursor
            && (sa = ea - 0.3)
            && (ea = ea + 0.3)
            this.g.beginPath()
            this.g.strokeStyle = this.previousColor
            this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false)
            this.g.stroke()
          }

          this.g.beginPath()
          this.g.strokeStyle = r ? this.o.fgColor : this.fgColor
          this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false)
          this.g.stroke()

          this.g.lineWidth = 2
          this.g.beginPath()
          this.g.strokeStyle = this.o.fgColor
          this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false)
          this.g.stroke()

          return false
        }
      }
    });

  
    /* END JQUERY KNOB */

    

  });


function preencherTabela(){
  execucaoService.dataset.forEach(function(empresa, index){
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    $(td).html(empresa.id_imoveis);
    $(tr).append(td);
    td = document.createElement("td");
    $(td).html(empresa.nome);
    if( index == 0 ){
       $(td).html( $(td).html() + "&nbsp;&nbsp;<span class=\"badge bg-danger\">Nova</span>");
    }
    $(tr).append(td);
    td = document.createElement("td");
    $(td).html(numeral(empresa.divida).format('$ 0,0.00'));
    $(tr).append(td);
    td = document.createElement("td");
    $(td).html(empresa.city + " - " + empresa.state);
    $(tr).append(td);
    td = document.createElement("td");
    $(td).html("<span class=\"badge bg-"+getChancesColor(empresa.rate)+"\">"+empresa.rate+"%</span>");
    $(tr).append(td);
    td = document.createElement("td");
    $(td).html("<a href=\"empresa-detalhe.html?processo="+empresa.id_imoveis+"\" class=\"text-muted\"><i class=\"fas fa-search\"></i></a>");
    $(tr).append(td);
    $("#tblEmpresas tbody").append(tr);
  });
}

function getChancesColor(chances){
  if(chances > 59){
    return "success";
  }else if(chances < 59 && chances > 49){
    return "warning"
  }else{
    return "danger";
  }
}

function verTodasEmpresas(){
   $('#modalMapa').on('shown.bs.modal', function () { // chooseLocation is the id of the modal.
      mapa.resize();
    });

    $('#modalMapa').modal('show');

    removerTodosMarcadores();
    objImovel = execucaoService.dataset[0];
    carregarDataSetImoveisTotal(objImovel.latitude, objImovel.longitude);
    plotarImoveisPgfn(execucaoService.dataset);
    plotar(mapa);
    mudarLocalizacao(mapa, objImovel.latitude, objImovel.longitude);
    
}


var execucaoService = new ExecucaoService(preencherTabela);

