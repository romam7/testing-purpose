var contFotos = 0;
//Gen
$(document).ready(function () {
	$(".tdToken").hide();
	$(".txtRojo").hide();

	$('.btnLogin').click(function () {
		$(".tdToken").show();
		$(".tdLogin").hide();
	});

	/*	$(".normal_select").dropkick({
			mobile: true
		});*/

	$("#effect").toggle(false);


	$(document).click(function () {
		$("#effect").toggle(false);
	});

	var altomax = 0;
	$('.mismoalto').each(function () {
		if ($(this).height() > altomax) {
			altomax = $(this).height();
		}
	});
	$('.mismoalto').height(altomax + 200);


	$('.tab4').click(function () {
		$(".Tabsecciones div").removeClass("seccActiva");
		$(this).addClass("seccActiva");
		$(".Secc4").show();
		$(".Secc1,.Secc2, .Secc3").hide();
	});

	$('#buscador').click(function (e) {
		$("input").prop('disabled', true);
		$("textarea").prop('disabled', true);
		$(".normal_select").addClass('desac');
	});

	$('.tblGeneral tr').click(function (e) {
		$('.tblGeneral tr').removeClass("tdSelect");
		$(this).addClass("tdSelect");
		$('.tblGeneral tr th').parent().removeClass("tdSelect");

	});

	//Cambio combo tipo de cambio

	$(".selectTemaS").hide();
	$(".selectTemaH").hide();

	$('#selectTipoCambio').change(function () {
		if ($('#selectTipoCambio option:selected').val() == 1) {
			$(".selectTemaS").show();
			$(".selectTemaH").hide();
		}
		if ($('#selectTipoCambio option:selected').val() == 2) {
			$(".selectTemaS").hide();
			$(".selectTemaH").show();
		}
	});

	$("#checkUser1").click(function () {
		$("#checkUser2").click(function () {
			$("#checkUserAp1").click(function () {
				if ($("#checkUser1").is(':checked')) {
					$(".btnIngreso").removeClass('unclick');
					$(".btnIngreso").removeClass('desac');
				} else {
					$(".btnIngreso").addClass('unclick');
					$(".btnIngreso").addClass('desac');
				}
			});
		});
	});

	$(".contConfig").hide();

});
function eliminarFoto(idElem) {
	var btnImg = $("#" + idElem).parent().prev();
	$(btnImg).click(function (e) {
		$(this).parent().remove();
	});
	//	$("#"+idElem).parent().parent().remove();
}

$(".txtRojo").show();
$(".btnBusca").addClass('desac');
$(".btnBusca").addClass('btnR1');

$(".btnBusca1").addClass('desac');
$(".btnBusca1").addClass('btnR1');

function valida1(f) {
	console.log(f);
	//Usuario valido modal
	var value_str = String(f.buscaInterno.value);
	if (f.buscaInterno.value == "") {
		$(".txtRojo").show();
		$(".txtRojo").text('Debe llenar el campo');
		$(".btnBusca").addClass('desac');
		$(".btnBusca").addClass('btnR1');
		return false;
	} else if (f.buscaInterno.value == "0") {
		$(".txtRojo").show();
		$(".txtRojo").text('Personal no encontrado, intentalo de nuevo o ingresa el nombre completo');
		$(".btnBusca").addClass('desac');
		$(".btnBusca").addClass('btnR1');
		return false;
	} else {
		$(".txtRojo").hide();
		$(".btnBusca").removeClass('desac');
		$(".btnBusca").removeClass('btnR1');
		return false;
	}

}

function valida2(f) {
	$(".btnBusca1").removeClass('desac');
	$(".btnBusca1").removeClass('btnR1');
}



$(".divConfig1.uno").mouseover(function () {
	$(".divConfig1 div img.imgIco1").attr("src", "../assets/img/ico01.svg");
	$(".divConfig1 div img.imgIco2").attr("src", "../assets/img/ico2.svg");
	$(".divConfig1 div img.imgIco3").attr("src", "../assets/img/ico3.svg");
	$(".divConfig1 div img.imgIco4").attr("src", "../assets/img/ico4.svg");
	$(".divConfig1 div img.imgIco5").attr("src", "../assets/img/ico5.svg");
});

$(".divConfig1.dos").mouseover(function () {
	$(".divConfig1 div img.imgIco1").attr("src", "../assets/img/ico1.svg");
	$(".divConfig1 div img.imgIco2").attr("src", "../assets/img/ico02.svg");
	$(".divConfig1 div img.imgIco3").attr("src", "../assets/img/ico3.svg");
	$(".divConfig1 div img.imgIco4").attr("src", "../assets/img/ico4.svg");
	$(".divConfig1 div img.imgIco5").attr("src", "../assets/img/ico5.svg");
});

$(".divConfig1.tres").mouseover(function () {
	$(".divConfig1 div img.imgIco1").attr("src", "../assets/img/ico1.svg");
	$(".divConfig1 div img.imgIco2").attr("src", "../assets/img/ico2.svg");
	$(".divConfig1 div img.imgIco3").attr("src", "../assets/img/ico03.svg");
	$(".divConfig1 div img.imgIco4").attr("src", "../assets/img/ico4.svg");
	$(".divConfig1 div img.imgIco5").attr("src", "../assets/img/ico5.svg");
});

$(".divConfig1.cuatro").hover(function () {
	$(".divConfig1 div img.imgIco1").attr("src", "../assets/img/ico1.svg");
	$(".divConfig1 div img.imgIco2").attr("src", "../assets/img/ico2.svg");
	$(".divConfig1 div img.imgIco3").attr("src", "../assets/img/ico3.svg");
	$(".divConfig1 div img.imgIco4").attr("src", "../assets/img/ico04.svg");
	$(".divConfig1 div img.imgIco5").attr("src", "../assets/img/ico5.svg");
});

$(".divConfig1.cinco").mouseover(function () {
	$(".divConfig1 div img.imgIco1").attr("src", "../assets/img/ico1.svg");
	$(".divConfig1 div img.imgIco2").attr("src", "../assets/img/ico2.svg");
	$(".divConfig1 div img.imgIco3").attr("src", "../assets/img/ico3.svg");
	$(".divConfig1 div img.imgIco4").attr("src", "../assets/img/ico4.svg");
	$(".divConfig1 div img.imgIco5").attr("src", "../assets/img/ico05.svg");
});

$(".divConfig1").mouseleave(function () {
	$(".divConfig1 div img.imgIco1").attr("src", "../assets/img/ico1.svg");
	$(".divConfig1 div img.imgIco2").attr("src", "../assets/img/ico2.svg");
	$(".divConfig1 div img.imgIco3").attr("src", "../assets/img/ico3.svg");
	$(".divConfig1 div img.imgIco4").attr("src", "../assets/img/ico4.svg");
	$(".divConfig1 div img.imgIco5").attr("src", "../assets/img/ico5.svg");
});

//Acordeon
jQuery(function () {

	var allPanels = $('.accordion > dd').hide();

	jQuery('.accordion > dt').on('click', function () {
		$this = $(this);
		//the target panel content
		$target = $this.next();

		jQuery('.accordion > dt').removeClass('accordion-active');
		if ($target.hasClass("in")) {
			$this.removeClass('accordion-active');
			$target.slideUp();
			$target.removeClass("in");

		} else {
			$this.addClass('accordion-active');
			jQuery('.accordion > dd').removeClass("in");
			$target.addClass("in");
			$(".subSeccion").show();

			jQuery('.accordion > dd').slideUp();
			$target.slideDown();
		}
	});

	var allPanels = $('.accordion2 > dd').hide();

	jQuery('.accordion2 > dt').on('click', function () {
		$this = $(this);
		//the target panel content
		$target = $this.next();

		jQuery('.accordion2 > dt').removeClass('accordion-active');
		if ($target.hasClass("in")) {
			$this.removeClass('accordion-active');
			$target.slideUp();
			$target.removeClass("in");

		} else {
			$this.addClass('accordion-active');
			jQuery('.accordion2 > dd').removeClass("in");
			$target.addClass("in");
			$(".subSeccion2").show();

			jQuery('.accordion2 > dd').slideUp();
			$target.slideDown();
		}
	});
});

//Calendario

$.datepicker.regional['es'] = {
	closeText: 'Cerrar',
	prevText: '',
	nextText: ' ',
	currentText: 'Hoy',
	monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
	monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
	dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
	dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
	dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
	weekHeader: 'Sm',
	dateFormat: 'dd/mm/yy',
	firstDay: 1,
	isRTL: false,
	showMonthAfterYear: false,
	yearSuffix: ''
};
$.datepicker.setDefaults($.datepicker.regional['es']);
	/*$(function() {
	$( "#datepicker" ).datepicker({firstDay: 1 });
	$( "#datepicker1" ).datepicker({firstDay: 1 });
	$( "#datepicker2" ).datepicker({firstDay: 1 });
	$( "#datepicker3" ).datepicker({firstDay: 1 });
	$( "#datepicker4" ).datepicker({firstDay: 1 });
	$( "#datepicker5" ).datepicker({firstDay: 1 });
	$( "#datepicker6" ).datepicker({firstDay: 1 });
});*/






