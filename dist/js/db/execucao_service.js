class ExecucaoService{
	constructor(callback){
		this._dataset = null;
		this.conectar(callback);
	}

	set dataset(ds){
		this._dataset = ds;
	}

	get dataset(){
		return this._dataset;
	}

	conectar(callback){
	     var url = "http://139.64.244.144:3000/imoveis";
		 $.ajax({
		        type: "GET",
		        url: url,
		    }).done(
	        $.proxy(function(data) { 
	           this._instancia.dataset = data;
	           if(callback)
	           		callback();
	        }, {_instancia: this}));
	}

	buscar(id){
		var retorno = null;
		this._dataset.forEach(function(processo, index){
			if(processo.id_imoveis == id){
				retorno = processo;
			}
		});
		return retorno;
	}

	
}