// binding to enable "declarative" navigation between pages
var androidstuckModel=function(){
	var self=this;
	
		
	self.init =function(){
	self.updates= ko.observableArray();
		valueDate=new Date(2009,04,13);
		jQuery.DSt.set("dateNote", valueDate);
		//Extraemos fecha de lectura
		var valueDate = jQuery.DSt.get("dateNote");
		
		if(!valueDate==null){
			valueDate=new Date(2009,04,13);
			 jQuery.DSt.set("dateNote", valueDate);
		}
		
		self.dateNotification = ko.observable(new Date(valueDate));
		//self.theme=ko.observable("d");	//
		self.theme=ko.observable(jQuery.DSt.get("theme")||"t");	
		//self.numNotRead=ko.observable(0);//
		self.refreshDate=ko.observable(jQuery.DSt.get("refreshDate")||"0");	
		self.numNotRead=ko.observable(jQuery.DSt.get("noRead")||0);
		self.selectedOptionRefresh=ko.observable("6 hour");
		self.selectedOptionAutomatic=ko.observable(jQuery.DSt.get("optAut")||"on");
		self.selectedOptionNotification=ko.observable(jQuery.DSt.get("optNot")||"on");
	};
	
	self.init();
	self.newUpdate = function(t,l,d,r){
		
		self.updates.push({
		title: t,
		link: l,
		date: d,
		read: ko.observable(r),
		});
	};
	self.refresh=function(){
		// $.mobile.pageLoading();   
		$.ajax({
		type: "GET",
		url: "rss.xml",
		dataType: "xml",
		success: self.xmlParser	,
		});	
	//	$.mobile.pageLoading( true ); 
		return true;		
	}
	self.refreshButton=function(){
		self.refresh();		
		self.listRefresh();
		return true;
	}
	
	self.allRead=function(d){
		for( var i=0;i < self.updates().length;i++){
			if(d>=self.updates()[i].date){
			self.updates()[i].read(0);
			if(self.numNotRead()>1)
				self.numNotRead(self.numNotRead()-1);
			}			
		};
		self.dateNotification( d);
		self.listRefresh();
		 jQuery.DSt.set("noRead", self.numNotRead());
		jQuery.DSt.set("dateNote", d);
	}
	
	self.listRefresh= function(){
		$.ajax({
        url : "index.html",
        complete: function() {
                 $("#list").listview("refresh");
        }
        
    });
	
	}
	self.clickLink=function(data){
		
		// if(data.read()==1 && self.numNotRead()>1){
			// data.read(0);
			// self.numNotRead(self.numNotRead()-1);
		// }
		if(self.dateNotification() <data.date)
			self.dateNotification(data.date);
		self.allRead(data.date);
		//self.listRefresh();
		return true;
	}
	
	
	self.changeTheme= function(){
		//self.theme(t);	
		//jQuery.DSt.set("theme", t);
		
		
		$.mobile.changePage( "index.html", { transition: "slideup", reloadPage:"true"} );
		//self.listRefresh();
		//$('#choosecolor').trigger("enhance");
		//$('#choosecolor').listview('refresh');
		return true;
	}
	
	//xmlParser(xml);
	self.xmlParser=function xmlParser(xml) { 
		 self.updates.destroyAll();
		 self.numNotRead(0);
		$(xml).find("item").each(function () {
		
 			 var l=$(this).find("link").text();
			 var t=$(this).find("title").text();
			 var d=new Date($(this).find("pubDate").text());
			 var r =0;
			 if(d>self.dateNotification()){
			 var r=1;
			 self.numNotRead(self.numNotRead()+1);	
			 }
			 self.newUpdate(t,l,d,r);
			 
		});
	
	return true;
	};
	self.refresh();
}
ko.bindingHandlers.jqmChangePage = {
    'init':   function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
	      $(element).on('click', function() {
			
    		var t = valueAccessor();           
			model.theme(t);	
      		 jQuery.DSt.set("theme", t);
        });
	},

}


var model= new androidstuckModel();
(function($)
{
    $(document).ready(function()
	{
		var refreshtime=jQuery.DSt.get("refreshTime");
		if(refreshtime==null){
			refreshtime=9000;
		}
        var refreshId = setInterval(function()
        {
            model.refreshButton();
			jQuery.DSt.set("refreshDate", new Date());			
        }, refreshtime);
    });
})(jQuery);
ko.applyBindings(model);
