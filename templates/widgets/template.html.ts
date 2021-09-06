import type { TemplateFunction } from "../../src/lib/createAdapter";

const templateFunction: TemplateFunction = answers => {

	const isWidget = answers.features.indexOf("vis") > -1;
	if (!isWidget) return;

	const widgetName = answers.adapterName;
	const widgetNameCapitalized = widgetName[0].toUpperCase() + widgetName.slice(1);

	const template = `
<!--
	ioBroker.vis ${widgetName} Widget-Set

	version: "0.0.1"

	Copyright ${new Date().getFullYear().toString()} ${answers.authorName} ${answers.authorEmail}
-->
<!-- here you can include so many css as you want -->
<link rel="stylesheet" href="widgets/${answers.adapterName}/css/style.css" />
<!-- here you can include so many js-files as you want -->
<script type="text/javascript" src="widgets/${answers.adapterName}/js/${answers.adapterName}.js"></script>

<!-- the full description of format in data-vis-attrs can be found here:
	https://github.com/ioBroker/ioBroker.vis/blob/master/www/js/visEditInspect.js#L39

	----------------------------------------------------------
	Mandatory XML attributes:
		id="tpl${widgetNameCapitalized}WIDGETNAME"
		type="text/ejs"
		class="vis-tpl"

		"type" and "class" are always the same. "id" is unique and must start with "tplSETNAME" and ends with widget name. Use camel-case for it.

	----------------------------------------------------------
	data-vis-attrs - divided with semicolon the list of attributes, like attr1/id;attr2/color
		Full format of one attribute is: attr_name(start-end)[default_value]/type,idFilter/onChangeFunc
			attr_name - the name of the attribute, e.g. "myID"
			start-end - creates automatically attributes from attr_namestart to attr_nameend, like "myID(1-3)" creates myID1, myID2, myID3
			default_value - by creation of widget this attribute will be filled with this value, e.g. "myID[#001122]/color"
			type - some predefined types have edit helpers, else it will be shown as text field

				Type format:
					  id - Object ID Dialog
					  checkbox
					  image - image
					  number,min,max,step - non-float number. min,max,step are optional
					  color - color picker
					  views - Name of the view
					  effect - jquery UI show/hide effects
					  eff_opt - additional option to effect slide (up, down, left, right)
					  fontName - Font name
					  slider,min,max,step - Default step is ((max - min) / 100)
					  select,value1,value2,... - dropdown select
					  nselect,value1,value2,... - same as select, but without translation of items
					  style,fileFilter,nameFilter,attrFilter
					  custom,functionName,options,... - custom editor - functionName is starting from vis.binds.[widgetset.funct]. E.g. custom/timeAndWeather.editWeather,short
					  group.name - define new or old group. All following attributes belongs to new group till new group.xyz
					  group.name/byindex - like group, but all following attributes will be grouped by ID. Like group.windows/byindex;slide(1-4)/id;slide_type(1-4)/select,open,closed  Following groups will be created Windows1(slide1,slide_type1), Windows2(slide2,slide_type2), Windows3(slide3,slide_type3), Windows4(slide4,slide_type4)
					  text - dialog box with html editor
					  html - dialog box with html editor

				If type is "id", you can define filer for "Select ID Dialog", like "myID/id,level.temperature".
				Additionally you can define callback(onChangeFunc), which will be called if this attribute was changed by user for different purposes: validate entry, fill other attributes, ...

		You can define additional data-vis-attrs line: data-vis-attrs0, data-vis-attrs1. Anyway data-vis-attrs must be there. You may not skip numbers.
		E.g. in "data-vis-attrs="A;" data-vis-attrs1="B" attribute B will be not parsed.

	--------------------------------------------------------
	data-vis-type
		Help information for user. Used for search.
		You can define more than one type divided by comma.
		There are following common types, but you can use your own specific types:
			ctrl   - widget that can write some Object IDs
			val    - widget that shows some information from Object IDs
			static - widget do not read information from Object IDs or URL
			button - button widget
			dimmer - dimmer widget
			weather - weather widget
			...

	--------------------------------------------------------
	data-vis-set
		Name of the widget set. Must be equal to the name of this HTML file

	--------------------------------------------------------
	data-vis-prev
		Html code used as preview of this widget. If widget is complex you can just use image as preview:
		data-vis-prev='<img src="widgets/hqwidgets/img/prev/Prev_tpl${widgetNameCapitalized}ShowInstance.png"></img>'
		Of course the image must exist.

	--------------------------------------------------------
	data-vis-name
		Readable name of widget shown in vis editor.

	--------------------------------------------------------
	data-vis-beta="true"
		Shows "BETA" symbol in vis editor by preview

	--------------------------------------------------------
	data-vis-update-style="true"
		Call redraw of widget if some of the CSS styles in editor for this widget was changed


	You can read about Magic tags here: http://canjs.com/guides/EJS.html
	Following magic tags are exist:
		<% %> - execute javascript
		<%= %> - place escaped result to HTML document
		<%== %> - place unescaped result to HTML document

	You can do "if" conditions and "for" cycles.

-->
<script id="tpl${widgetNameCapitalized}ShowInstance"
		type="text/ejs"
		class="vis-tpl"
		data-vis-prev='<div id="prev_tpl${widgetNameCapitalized}ShowInstance" style="position: relative; text-align: initial;padding: 4px "><div class="vis-widget_prev " style="width: 280px; height: 159px;" > <div class="${widgetName}-class vis-widget-prev-body " style="padding:2px"> OID: hm-rpc.0.EEQ0006629.1.STATE<br> OID value: true<br> Color: <span style="color: rgb(128, 0, 0);">#800000</span><br> htmlText: <textarea readonly="" style="width:100%">asda</textarea></div>'
		data-vis-attrs="oid/id;myColor/color;htmlText/text;"
		data-vis-attrs0="group.extra${widgetNameCapitalized};extraAttr"
		data-vis-set="${widgetName}"
		data-vis-type="helper"
		data-vis-name="Show instance">
	<div class="vis-widget <%== this.data.attr('class') %>" style="width:230px; height:210px;" id="<%= this.data.attr('wid') %>" >
		<div class="${widgetName}-class vis-widget-body <%== this.data.attr('class') %>" style="padding:2px" >
			OID: <%= this.data.attr('oid') %><br>
			OID value: <%== vis.states[this.data.attr('oid') + '.val'] %><br>
			Color: <span style="color: <%= this.data.attr('myColor') %>"><%= this.data.attr('myColor') %></span><br>
			extraAttr: <%== this.data.attr('extraAttr') %><br>
			Browser instance: <%= vis.instance %><br>
			htmlText: <textarea readonly style="width: calc(100% - 10px)"><%== this.data.attr('htmlText') %></textarea><br>
		</div>
	</div>
</script>

<script id="tpl${widgetNameCapitalized}Helper"
		type="text/ejs"
		class="vis-tpl"
		data-vis-prev='<div id="prev_tpl${widgetNameCapitalized}Helper" style="position: relative; text-align: initial;padding: 4px "><div class="vis-widget_prev " style="width: 280px; height: 159px;" > <div class="${widgetName}-class vis-widget-prev-body " style="padding:2px"> OID: hm-rpc.0.EEQ0006629.1.STATE<br> OID value: true<br> Color: <span style="color: rgb(128, 0, 0);">#800000</span><br> htmlText: <textarea readonly="" style="width:100%">asda</textarea></div>'
		data-vis-attrs="oid/id;myColor/color;htmlText/text;"
		data-vis-attrs0="group.extra${widgetNameCapitalized};extraAttr"
		data-vis-set="${widgetName}"
		data-vis-type="helper"
		data-vis-name="Helper">
	<div class="vis-widget <%== this.data.attr('class') %>" style="overflow:visible; width: 230px; height: 210px" id="<%= this.data.attr('wid') %>"><%
		vis.binds['${widgetName}'].createWidget(this.data.wid, this.view, this.data, this.style);
	%></div>
</script>
`;
	return template.trim();
};

templateFunction.customPath = answers => `widgets/${answers.adapterName}.html`;
export = templateFunction;
