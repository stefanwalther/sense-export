### Dimensions & Measures

Define dimensions and measures as you would do for every other extension.
Pro Tip: Enable the debug mode if you want to see the result.

### Button label

- **Label** - Just define the label of the button, defaults to "Export".

![Button label property]({%= verb.baseImgUrl %}docs/images/prop-label.png)

### Button layout

The possibilities to layout the button should (hopefully) be pretty self-explanatory:

- **Style** - Select on of the predefined styles.
- **Button width** - Define whether the button should take the full width of the object or not.
- **Alignment** - Define the **horizontal** alignment.
- **Icon** - Select one of the provided icons. Defaults to "download"
Pro Tip: Font Awesome icons are used here, go to https://fortawesome.github.io/Font-Awesome/icons/ to get a nice overview of all icons possible.

![Property export definition]({%= verb.baseImgUrl %}docs/images/prop-export-definition.png)

### Export definition

Define the final output of the export:

- **Format** - Select on of the following values (defaults ot "Open XML (Excel)): 
  1) Open XML (Excel), 
  2) Comma separated CSV, 
  3) Tab separated CSV"
  4) Comma separated CSV - Client Side (see below for more information)
- **State** - You can define whether your current selection will be considered or not. If this is the desired behavior, select "Possible values", otherwise "All values", then always all data will be exported, regardless the current selections.
- **File name** - Optionally you can define a file name.

![Property export definition]({%= verb.baseImgUrl %}docs/images/prop-export-definition.png)

#### A note on "Comma separated CSV - Client Side"
This is an experimental feature and will generated the exported file client-side, so in your browser, and not using the QIX Engine to generated the file.
Why? There is a scenario where Qlik Sense Enterprise is configured to provide anonymous access to dashboard. In that case the QIX Engine generates the export files, but QRS does not allow to serve them (this can obviously seen as a bug and is being investigated). 

Use this functionality with caution

- Client side generation of export files is much slower
- You might run into issues with larger data-sets

Currently tested only with this setup:

- Qlik Sense 3.2 SR3
- Chrome, Firefox, IE


### Debug
While working in edit mode it's quite helpful to test the data (which will then be exported in the defined format).
If you enable the debug mode a debug table will be shown to double-check if you you have defined the correct measures and dimensions.

Note:
- The debug table will only be shown in edit mode, even if this settings is activated
- The debug table only shows the first 500 records (for performance reasons). The export will contain all data, though.

![Property debug]({%= verb.baseImgUrl %}docs/images/prop-debug.png)
