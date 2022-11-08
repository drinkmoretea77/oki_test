import Vue from 'vue';
import { VueEditor, Quill } from 'vue2-editor';

const Block = Quill.import('blots/block');
Block.tagName = 'div';
Quill.register(Block);

const Iframe = Quill.import('blots/block/embed');
class InsIframe extends Iframe {
    static create(value) {
        const node = super.create(value);
        node.setAttribute('src', value.url);
        node.setAttribute('frameborder', '0');
        node.setAttribute('mozallowfullscreen', true);
        node.setAttribute('webkitallowfullscreen', true);
        node.setAttribute('allowfullscreen', true);
        node.setAttribute('width', value.width);
        node.setAttribute('height', value.height);
        return node;
    }
}
 
InsIframe.blotName = 'ins-iframe';
InsIframe.tagName  = 'iframe';
Quill.register(InsIframe,true);

const DirectionAttribute = Quill.import('attributors/attribute/direction');
Quill.register(DirectionAttribute,true);

const AlignClass = Quill.import('attributors/class/align');
Quill.register(AlignClass,true);

const BackgroundClass = Quill.import('attributors/class/background');
Quill.register(BackgroundClass,true);

const ColorClass = Quill.import('attributors/class/color');
Quill.register(ColorClass,true);

const DirectionClass = Quill.import('attributors/class/direction');
Quill.register(DirectionClass,true);

const FontClass = Quill.import('attributors/class/font');
Quill.register(FontClass,true);

const SizeClass = Quill.import('attributors/class/size');
Quill.register(SizeClass,true);

const AlignStyle = Quill.import('attributors/style/align');
Quill.register(AlignStyle,true);

const BackgroundStyle = Quill.import('attributors/style/background');
Quill.register(BackgroundStyle,true);

const ColorStyle = Quill.import('attributors/style/color');
Quill.register(ColorStyle,true);

const DirectionStyle = Quill.import('attributors/style/direction');
Quill.register(DirectionStyle,true);

const FontStyle = Quill.import('attributors/style/font');
Quill.register(FontStyle,true);

const SizeStyle = Quill.import('attributors/style/size');
Quill.register(SizeStyle,true);

Vue.component('vue-editor', VueEditor);