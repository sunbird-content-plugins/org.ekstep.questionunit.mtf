 /**
  *
  * Plugin to create mcq question
  * @extends org.ekstep.contenteditor.questionUnitPlugin
  * @author Jagadish P <jagadish.pujari@tarento.com>
  */
 org.ekstep.questionunitMTF = {};
 org.ekstep.questionunitMTF.EditorPlugin = org.ekstep.contenteditor.questionUnitPlugin.extend({
   initialize: function() {
     this._super();
     var instance = this;
     var templatePath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'editor/templates/mtf-template.html');
     var controllerPath = ecEditor.resolvePluginResource(instance.manifest.id, instance.manifest.ver, 'editor/controllers/mtf-controller.js');
     ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);
   }
 });
 //# sourceURL=mtfpluginEditorPlugin.js