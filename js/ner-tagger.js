var nertagger = {

    wrapTag: function (tag) {
        // Code from http://coursesweb.net/javascript/add-tag-selected-text-textarea_cs

        var start_tag = 'START:' + tag.data.name;
        var end_tag = 'END';

        var tag_type = new Array('<', '>');        // for BBCode tag, replace with:  new Array('[', ']');
        var txta = document.getElementById('annotator-field-0');
        var start = tag_type[0] + start_tag + tag_type[1];
        var end = tag_type[0] + end_tag +  tag_type[1];

        if (txta.selectionStart || txta.selectionStart == "0") {
            var startPos = txta.selectionStart;
            var endPos = txta.selectionEnd;
            // Spaces need for an avoidance of OpenNLP parsing errors
            var tag_seltxt = ' ' + start + ' ' + txta.value.substring(startPos, endPos) + ' ' + end + ' ';
            txta.value = txta.value.substring(0, startPos) + tag_seltxt + txta.value.substring(endPos, txta.value.length);

            // Place the cursor between formats in #txta
            txta.setSelectionRange((endPos+start.length),(endPos+start.length));
            txta.focus();
        }
    },

    submit: function () {
        chrome.runtime.sendMessage(this.element.find('textarea:first').val(), function (response) {
            console.log(response);
            if (response.status === 'error') {
                annotator.notification.defaultNotifier("Have not been sent: " + response.code + " " + response.text,'error');
            }
        });
        this.hide();
    },

    addButton: function (options) {

        var field = $.extend({
            id: 'annotator-field-',
            type: 'input',
            label: '',
            load: function () {},
            submit: function () {}
        }, options);

        var element = $('<li class="annotator-item" />');

        field.element = element[0];

        var button1 = $('<button id="ner-btn1" type="button" class="ner-tagger" style="padding: 1px; margin: 1px">DATE</button>');
        var button2 = $('<button id="ner-btn2" type="button" class="ner-tagger" style="padding: 1px; margin: 1px">FAC</button>');
        var button3 = $('<button id="ner-btn3" type="button" class="ner-tagger" style="padding: 1px; margin: 1px">GPE</button>');
        var button4 = $('<button id="ner-btn4" type="button" class="ner-tagger" style="padding: 1px; margin: 1px">LOC</button>');
        var button5 = $('<button id="ner-btn5" type="button" class="ner-tagger" style="padding: 1px; margin: 1px">MONEY</button>');
        var button6 = $('<button id="ner-btn6" type="button" class="ner-tagger" style="padding: 1px; margin: 1px">ORG</button>');
        var button7 = $('<button id="ner-btn7" type="button" class="ner-tagger" style="padding: 1px; margin: 1px">PER</button>');
        var button8 = $('<button id="ner-btn8" type="button" class="ner-tagger" style="padding: 1px; margin: 1px">TIME</button>');

        element.append(button1,button2,button3,button4,button5,button6,button7,button8);

        // Chrome secuirty doesn't allow to use 'onClick'
        $(document).ready(function() {
            $("#ner-btn1").click({name: "DATE"}, nertagger.wrapTag);
            $("#ner-btn2").click({name: "FAC"}, nertagger.wrapTag);
            $("#ner-btn3").click({name: "GPE"}, nertagger.wrapTag);
            $("#ner-btn4").click({name: "LOC"}, nertagger.wrapTag);
            $("#ner-btn5").click({name: "MONEY"}, nertagger.wrapTag);
            $("#ner-btn6").click({name: "ORG"}, nertagger.wrapTag);
            $("#ner-btn7").click({name: "PER"}, nertagger.wrapTag);
            $("#ner-btn8").click({name: "TIME"}, nertagger.wrapTag);
        });

        this.element.find('ul:first').append(element);
        this.fields.push(field);

        return field.element;
    },

    show: function(position) {
        // Set textarea value to selected text
        this.element.find('textarea:first').val(this.annotation.quote);
        //this.element.find('textarea:first').css('font-size', '11px');

        // Set width of the main window
        this.element.find('.annotator-widget').css('min-width', '300px');
        this.element.find('textarea:first').css('height', '300px');

        // Call original editor.show function
        this._pre_ner_show(position);
    },

    getEditorExtension: function editorExtension(editor) {
        editor.addButton = nertagger.addButton;
        editor.addButton();
        editor._pre_ner_show = editor.show;
        editor.show = nertagger.show;
        editor.submit = nertagger.submit;
    }
};


var app = new annotator.App();

app.include(
    annotator.ui.main, {
        editorExtensions: [nertagger.getEditorExtension]
    });
app.start();


