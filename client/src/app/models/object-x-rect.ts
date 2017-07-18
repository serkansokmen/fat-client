import { fabric } from 'fabric';


const ObjectXRect = fabric.util.createClass(fabric.Rect, {

  type: 'objectXRect',

  initialize: function(options) {
    options || (options = { });

    this.callSuper('initialize', options);
    this.set('label', options.label || '');
    this.set('rectangle', options.rectangle || null);
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      label: this.get('label'),
      rectangle: this.get('rectangle'),
    });
  },

  _render: function(ctx) {
    this.callSuper('_render', ctx);

    ctx.font = '20px Helvetica';
    ctx.fillStyle = '#333';

    ctx.fillText(this.label, -this.width/2, -this.height/2 + 20);
  }
});

export { ObjectXRect };
