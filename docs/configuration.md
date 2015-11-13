## Dimensions & Measures

Define dimensions and measures as you would do for every other extension.
Pro Tip: Enable the debug mode if you want to see the result.

## Button label

- **Label** - Just define the label of the button, defaults to "Export".

![]({%= verb.baseImgUrl %}docs/images/prop-label.png)

## Button layout

The possibilities to layout the button should (hopefully) be pretty self-explanatory:

- **Style** - Select on of the predefined styles.
- **Button width** - Define whether the button should take the full width of the object or not.
- **Alignment** - Define the **horizontal** alignment.
- **Icon** - Select one of the provided icons. Defaults to "download"
Pro Tip: Font Awesome icons are used here, go to https://fortawesome.github.io/Font-Awesome/icons/ to get a nice overview of all icons possible.

![]({%= verb.baseImgUrl %}docs/images/prop-export-definition.png)

## Export definition

Define the final output of the export:

- **Format** - Select on of the following values: 1) Open XML (Excel), 2) Comma separated CSV, 3) Tab separated CSV; defaults ot "Open XML (Excel)"
- **State** - You can define whether your current selection will be considered or not. If this is the desired behavior, select "Possible values", otherwise "All values", then always all data will be exported, regardless the current selections.
- **File name** - Optionally you can define a file name.

![]({%= verb.baseImgUrl %}docs/images/prop-export-definition.png)

## Debug
While working in edit mode it's quite helpful to test the data (which will then be exported in the defined format).
If you enable the debug mode a debug table will be shown to double-check if you you have defined the correct measures and dimensions.

Note:
- The debug table will only be shown in edit mode, even if this settings is activated
- The debug table only shows the first 500 records (for performance reasons). The export will contain all data, though.

![]({%= verb.baseImgUrl %}docs/images/prop-debug.png)