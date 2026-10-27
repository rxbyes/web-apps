/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, {Fragment} from 'react';
import {Link} from 'framework7-react';
import {Device} from '../../../../common/mobile/utils/device';
import SvgIcon from '@common/lib/component/SvgIcon';
import IconEditSettingsAndroid from '@common-android-icons/icon-edit-settings.svg';
import IconEditSettingsIos from '@common-ios-icons/icon-edit-settings.svg';
import IconPlusAndroid from '@common-android-icons/icon-plus.svg';
import IconPlusIos from '@common-ios-icons/icon-plus.svg';
import IconUndoAndroid from '@common-android-icons/icon-undo.svg';
import IconUndoIos from '@common-ios-icons/icon-undo.svg';
import IconRedoAndroid from '@common-android-icons/icon-redo.svg';
import IconRedoIos from '@common-ios-icons/icon-redo.svg';
import IconCopy from '@common-icons/icon-copy.svg';
import IconCut from '@common-icons/icon-cut.svg';
import IconPaste from '@common-icons/icon-paste.svg';
import {AddCommentController, EditCommentController} from '../../../../common/mobile/lib/controller/collaboration/Comments';

/*
 * Community Edition implementation of the mobile presentation editor glue
 * layer (EditorUIController). Upstream keeps the real implementation in the
 * private repository `web-apps-mobile/slide` and ships an inert stub in the
 * open-source tree; this file restores the functionality from the last open
 * revisions (fe1a9e16d3^, 45a9058da4^) adapted to the current API surface.
 */

const EditorUIController = () => {
    return null
};

EditorUIController.isSupportEditFeature = () => {
    return true
};

EditorUIController.getToolbarOptions = (opts = {}) => {
    const {disabledEdit, disabledAdd, onEditClick, onAddClick} = opts;

    return (
        <Fragment>
            <Link iconOnly key='btn-edit' id='btn-edit'
                  className={disabledEdit ? 'disabled' : ''}
                  href={false}
                  onClick={onEditClick}>
                <SvgIcon slot="media"
                         symbolId={Device.ios ? IconEditSettingsIos.id : IconEditSettingsAndroid.id}
                         className={'icon icon-svg'}/>
            </Link>
            <Link iconOnly key='btn-add' id='btn-add'
                  className={disabledAdd ? 'disabled' : ''}
                  href={false}
                  onClick={onAddClick}>
                <SvgIcon slot="media"
                         symbolId={Device.ios ? IconPlusIos.id : IconPlusAndroid.id}
                         className={'icon icon-svg'}/>
            </Link>
        </Fragment>
    );
};

EditorUIController.getUndoRedo = (opts = {}) => {
    const {disabledUndo, disabledRedo, onUndoClick, onRedoClick} = opts;

    return (
        <Fragment>
            <Link iconOnly key='btn-undo'
                  className={disabledUndo ? 'disabled' : ''}
                  href={false}
                  onClick={onUndoClick}>
                <SvgIcon slot="media"
                         symbolId={Device.ios ? IconUndoIos.id : IconUndoAndroid.id}
                         className={'icon icon-svg'}/>
            </Link>
            <Link iconOnly key='btn-redo'
                  className={disabledRedo ? 'disabled' : ''}
                  href={false}
                  onClick={onRedoClick}>
                <SvgIcon slot="media"
                         symbolId={Device.ios ? IconRedoIos.id : IconRedoAndroid.id}
                         className={'icon icon-svg'}/>
            </Link>
        </Fragment>
    );
};

EditorUIController.initThemeColors = () => {
    const api = Common.EditorApi.get();

    api.asc_registerCallback('asc_onSendThemeColors', (colors, standart_colors) => {
        Common.Utils.ThemeColor.setColors(colors, standart_colors);
    });
};

EditorUIController.initFonts = (storeTextSettings) => {
    const api = Common.EditorApi.get();

    api.asc_registerCallback('asc_onInitEditorFonts', (fonts, select) => {
        storeTextSettings.initEditorFonts(fonts, select);
    });
    api.asc_registerCallback('asc_onFontFamily', (font) => {
        storeTextSettings.resetFontName(font);
    });
    api.asc_registerCallback('asc_onFontSize', (size) => {
        storeTextSettings.resetFontSize(size);
    });
    api.asc_registerCallback('asc_onBold', (isBold) => {
        storeTextSettings.resetIsBold(isBold);
    });
    api.asc_registerCallback('asc_onItalic', (isItalic) => {
        storeTextSettings.resetIsItalic(isItalic);
    });
    api.asc_registerCallback('asc_onUnderline', (isUnderline) => {
        storeTextSettings.resetIsUnderline(isUnderline);
    });
    api.asc_registerCallback('asc_onStrikeout', (isStrikeout) => {
        storeTextSettings.resetIsStrikeout(isStrikeout);
    });
};

EditorUIController.initFocusObjects = (storeFocusObjects) => {
    const api = Common.EditorApi.get();

    api.asc_registerCallback('asc_onFocusObject', (objects) => {
        storeFocusObjects.resetFocusObjects(objects);
    });

    const getTopObjectByType = (type) => {
        const objects = [];
        for (let object of storeFocusObjects._focusObjects) {
            if (object.get_ObjectType() === type) {
                objects.push(object);
            }
        }
        if (objects.length > 0) {
            const object = objects[objects.length - 1]; // get top
            return object.get_ObjectValue();
        } else {
            return undefined;
        }
    };

    storeFocusObjects.intf = {
        filterFocusObjects: () => {
            const _settings = [];
            let no_text = true;
            for (let object of storeFocusObjects._focusObjects) {
                const type = object.get_ObjectType(),
                    objectValue = object.get_ObjectValue();
                if (Asc.c_oAscTypeSelectElement.Paragraph == type) {
                    if ( !objectValue.get_Locked() )
                        no_text = false;
                } else if (Asc.c_oAscTypeSelectElement.Table == type) {
                    if ( !objectValue.get_Locked() ) {
                        _settings.push('table');
                        no_text = false;
                    }
                } else if (Asc.c_oAscTypeSelectElement.Slide == type) {
                    if ( !(objectValue.get_LockLayout() || objectValue.get_LockBackground() || objectValue.get_LockTransition() || objectValue.get_LockTiming() ))
                        _settings.push('slide');
                } else if (Asc.c_oAscTypeSelectElement.Image == type) {
                    if ( !objectValue.get_Locked() )
                        _settings.push('image');
                } else if (Asc.c_oAscTypeSelectElement.Chart == type) {
                    if ( !objectValue.get_Locked() )
                        _settings.push('chart');
                } else if (Asc.c_oAscTypeSelectElement.Shape == type && !objectValue.get_FromChart()) {
                    if ( !objectValue.get_Locked() ) {
                        _settings.push('shape');
                        no_text = false;
                    }
                } else if (Asc.c_oAscTypeSelectElement.Hyperlink == type) {
                    _settings.push('hyperlink');
                }
            }
            if (!no_text && _settings.indexOf('image') < 0)
                _settings.unshift('text');
            const resultArr = _settings.filter((value, index, self) => self.indexOf(value) === index); // get uniq array
            // Exclude hyperlink if text is locked
            if (resultArr.indexOf('hyperlink') > -1 && resultArr.indexOf('text') < 0) {
                resultArr.splice(resultArr.indexOf('hyperlink'), 1);
            }
            // Exclude shapes if chart exist
            if (resultArr.indexOf('chart') > -1 && resultArr.indexOf('shape') > -1) {
                resultArr.splice(resultArr.indexOf('shape'), 1);
            }
            return resultArr;
        },
        getSlideObject: () => getTopObjectByType(Asc.c_oAscTypeSelectElement.Slide),
        getParagraphObject: () => getTopObjectByType(Asc.c_oAscTypeSelectElement.Paragraph),
        getTableObject: () => getTopObjectByType(Asc.c_oAscTypeSelectElement.Table),
        getLinkObject: () => getTopObjectByType(Asc.c_oAscTypeSelectElement.Hyperlink),
        getShapeObject: () => {
            const shapes = [];
            for (let object of storeFocusObjects._focusObjects) {
                if (object.get_ObjectType() === Asc.c_oAscTypeSelectElement.Shape) {
                    shapes.push(object);
                }
            }
            if (shapes.length > 0) {
                const object = shapes[shapes.length - 1]; // get top
                return object.get_ObjectValue();
            } else {
                return undefined;
            }
        },
        getImageObject: () => {
            const images = [];
            for (let object of storeFocusObjects._focusObjects) {
                if (object.get_ObjectType() == Asc.c_oAscTypeSelectElement.Image && object.get_ObjectValue()) {
                    images.push(object);
                }
            }
            if (images.length > 0) {
                const object = images[images.length - 1]; // get top
                return object.get_ObjectValue();
            } else {
                return undefined;
            }
        },
        getChartObject: () => {
            const charts = [];
            for (let object of storeFocusObjects._focusObjects) {
                if (object.get_ObjectType() == Asc.c_oAscTypeSelectElement.Chart) {
                    charts.push(object);
                }
            }
            if (charts.length > 0) {
                const object = charts[charts.length - 1]; // get top
                return object.get_ObjectValue();
            } else {
                return undefined;
            }
        },
    };
};

EditorUIController.initEditorStyles = (storeSlideSettings) => {
    const api = Common.EditorApi.get();

    api.asc_registerCallback('asc_onInitEditorStyles', themes => {
        storeSlideSettings.addArrayThemes(themes);
    });

    api.asc_registerCallback('asc_onUpdateThemeIndex', themeId => {
        storeSlideSettings.changeSlideThemeIndex(themeId);
    });

    api.asc_registerCallback('asc_onUpdateLayout', layouts => {
        storeSlideSettings.addArrayLayouts(layouts);
    });
};

EditorUIController.initTableTemplates = (storeTableSettings) => {
    const api = Common.EditorApi.get();

    api.asc_registerCallback('asc_onInitTableTemplates', () => {
        storeTableSettings.setStyles(api.asc_getTableStylesPreviews(true), 'default');
    });
};

EditorUIController.updateChartStyles = (storeChartSettings, storeFocusObjects) => {
    const api = Common.EditorApi.get();

    api.asc_registerCallback('asc_onUpdateChartStyles', () => {
        if (storeFocusObjects.chartObject) {
            storeChartSettings.updateChartStyles(api.asc_getChartPreviews(storeFocusObjects.chartObject.getType()));
        }
    });
};

EditorUIController.getEditCommentControllers = () => (
    <Fragment>
        <AddCommentController key='add-comment-controller' />
        <EditCommentController key='edit-comment-controller' />
    </Fragment>
);

EditorUIController.ContextMenu = {
    mapMenuItems: (context) => {
        const { t } = context.props;
        const _t = t("ContextMenu", { returnObjects: true });

        const { isDisconnected } = context.props;

        const api = Common.EditorApi.get();
        const stack = api.getSelectedElements();
        const canCopy = api.can_CopyCut();

        let itemsIcon = [],
            itemsText = [];

        let isText = false,
            isTable = false,
            isImage = false,
            isChart = false,
            isShape = false,
            isLink = false,
            isSlide = false,
            isObject = false;

        stack.forEach(item => {
            const objectType = item.get_ObjectType(),
                objectValue = item.get_ObjectValue();

            if (objectType == Asc.c_oAscTypeSelectElement.Paragraph) {
                isText = true;
            } else if (objectType == Asc.c_oAscTypeSelectElement.Image) {
                isImage = true;
            } else if (objectType == Asc.c_oAscTypeSelectElement.Chart) {
                isChart = true;
            } else if (objectType == Asc.c_oAscTypeSelectElement.Shape) {
                isShape = true;
            } else if (objectType == Asc.c_oAscTypeSelectElement.Table) {
                isTable = true;
            } else if (objectType == Asc.c_oAscTypeSelectElement.Hyperlink) {
                isLink = true;
            } else if (objectType == Asc.c_oAscTypeSelectElement.Slide) {
                isSlide = true;
            }
        });

        isObject = isText || isImage || isChart || isShape || isTable;

        if (canCopy && isObject) {
            itemsIcon.push({
                event: 'copy',
                icon: IconCopy.id
            });
        }

        if ( stack.length > 0 ) {
            let topObject = stack[stack.length - 1],
                topObjectValue = topObject.get_ObjectValue(),
                objectLocked = typeof topObjectValue.get_Locked === 'function' ? topObjectValue.get_Locked() : false;

            !objectLocked && (objectLocked = typeof topObjectValue.get_LockDelete === 'function' ? topObjectValue.get_LockDelete() : false);

            const swapItems = function(items, indexBefore, indexAfter) {
                items[indexAfter] = items.splice(indexBefore, 1, items[indexAfter])[0];
            };

            if (!objectLocked && !isDisconnected) {
                if (canCopy && isObject) {
                    itemsIcon.push({
                        event: 'cut',
                        icon: IconCut.id
                    });

                    // Swap 'Copy' and 'Cut'
                    swapItems(itemsIcon, 0, 1);
                }

                itemsIcon.push({
                    event: 'paste',
                    icon: IconPaste.id
                });

                if (isObject)
                    itemsText.push({
                        caption: _t.menuDelete,
                        event: 'delete'
                    });

                itemsText.push({
                    caption: _t.menuEdit,
                    event: 'edit'
                });

                if (!isLink && api.can_AddHyperlink() !== false) {
                    itemsText.push({
                        caption: _t.menuAddLink,
                        event: 'addlink'
                    });
                }

                if (context.isComments && context.props.canViewComments) {
                    itemsText.push({
                        caption: _t.menuViewComment,
                        event: 'viewcomment'
                    });
                }

                const hideAddComment = (isText && isChart) || api.can_AddQuotedComment() === false || !context.props.canViewComments;
                if (!hideAddComment) {
                    itemsText.push({
                        caption: _t.menuAddComment,
                        event: 'addcomment'
                    });
                }
            }
        }

        if (isLink) {
            itemsText.push({
                caption: _t.menuOpenLink,
                event: 'openlink'
            });
        }

        if ( Device.phone && itemsText.length > 2 ) {
            context.extraItems = itemsText.splice(2, itemsText.length, {
                caption: _t.menuMore,
                event: 'showActionSheet'
            });
        }

        return itemsIcon.concat(itemsText);
    },

    handleMenuItemClick: (context, action) => {
        const api = Common.EditorApi.get();

        switch (action) {
            case 'addcomment':
                Common.Notifications.trigger('addcomment');
                return true;
            case 'delete':
                api.asc_Remove();
                return true;
            case 'edit':
                setTimeout(() => {
                    context.props.openOptions('edit');
                }, 0);
                return true;
            case 'addlink':
                setTimeout(() => {
                    context.props.openOptions('add', 'link');
                }, 400);
                return true;
        }

        return false;
    },
};

export default EditorUIController;
