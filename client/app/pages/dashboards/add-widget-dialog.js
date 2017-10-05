import template from './add-widget-dialog.html';

const AddWidgetDialog = {
  template,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  controller($sce, toastr, Query, Widget) {
    'ngInject';

    this.dashboard = this.resolve.dashboard;
    this.saveInProgress = false;
    this.widgetSize = 1;
    this.selectedVis = null;
    this.query = {};
    this.selected_query = undefined;
    this.text = '';
    this.existing_text = '';
    this.new_text = '';
    this.widgetSizes = [{
      name: 'Regular',
      value: 1,
    }, {
      name: 'Double',
      value: 2,
    }];

    this.type = 'visualization';

    this.trustAsHtml = html => $sce.trustAsHtml(html);
    this.isVisualization = () => this.type === 'visualization';
    this.isTextBox = () => this.type === 'textbox';

    this.setType = (type) => {
      this.type = type;
      if (type === 'textbox') {
        this.widgetSizes.push({ name: 'Hidden', value: 0 });
      } else if (this.widgetSizes.length > 2) {
        this.widgetSizes.pop();
      }
    };

    this.onQuerySelect = () => {
      if (!this.query.selected) {
        return;
      }

      Query.get({ id: this.query.selected.id }, (query) => {
        if (query) {
          this.selected_query = query;
          if (query.visualizations.length) {
            this.selectedVis = query.visualizations[0];
          }
        }
      });
    };

    this.searchQueries = (term) => {
      if (!term || term.length < 3) {
        return;
      }

      Query.search({ q: term }, (results) => {
        this.queries = results;
      });
    };

    this.saveWidget = () => {
      this.saveInProgress = true;
      const widget = new Widget({
        visualization_id: this.selectedVis && this.selectedVis.id,
        dashboard_id: this.dashboard.id,
        options: {},
        width: this.widgetSize,
        text: this.text,
      });

      widget.$save().then((response) => {
        // update dashboard layout
        this.dashboard.layout = response.layout;
        this.dashboard.version = response.version;
        const newWidget = new Widget(response.widget);
        if (response.new_row) {
          this.dashboard.widgets.push([newWidget]);
        } else {
          this.dashboard.widgets[this.dashboard.widgets.length - 1].push(newWidget);
        }
        this.close();
      }).catch(() => {
        toastr.error('Widget can not be added');
      }).finally(() => {
        this.saveInProgress = false;
      });
    };
  },
};

export default function init(ngModule) {
  ngModule.component('addWidgetDialog', AddWidgetDialog);
}
