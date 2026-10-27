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
 * Community Edition implementation of the mobile document editor glue layer
 * (EditorUIController). Upstream keeps the real implementation in the private
 * repository `web-apps-mobile/word` and ships an inert stub in the open-source
 * tree; this file restores the functionality from the last open revisions
 * (09102047c1^, ee15cf025d^, 94b4ebc18c^, b0c9a1c5d2^, cd1aa44b5c^)
 * adapted to the current API surface.
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
            for (let object of storeFocusObjects._focusObjects) {
                let type = object.get_ObjectType();
                if (Asc.c_oAscTypeSelectElement.Paragraph === type) {
                    _settings.push('text', 'paragraph');
                } else if (Asc.c_oAscTypeSelectElement.Table === type) {
                    _settings.push('table');
                } else if (Asc.c_oAscTypeSelectElement.Image === type) {
                    if (object.get_ObjectValue().get_ChartProperties()) {
                        // Exclude shapes if chart exist
                        let si = _settings.indexOf('shape');
                        si < 0 ? _settings.push('chart') : _settings.splice(si,1,'chart');
                    } else if (object.get_ObjectValue().get_ShapeProperties() && !_settings.includes('chart')) {
                        _settings.push('shape');
                    } else {
                        _settings.push('image');
                    }
                } else if (Asc.c_oAscTypeSelectElement.Hyperlink === type) {
                    _settings.push('hyperlink');
                } else if (Asc.c_oAscTypeSelectElement.Header === type) {
                    _settings.push('header');
                }
            }
            return _settings.filter((value, index, self) => self.indexOf(value) === index);
        },
        getHeaderObject: () => getTopObjectByType(Asc.c_oAscTypeSelectElement.Header),
        getParagraphObject: () => getTopObjectByType(Asc.c_oAscTypeSelectElement.Paragraph),
        getTableObject: () => getTopObjectByType(Asc.c_oAscTypeSelectElement.Table),
        getLinkObject: () => getTopObjectByType(Asc.c_oAscTypeSelectElement.Hyperlink),
        getShapeObject: () => {
            const shapes = [];
            for (let object of storeFocusObjects._focusObjects) {
                if (object.get_ObjectType() === Asc.c_oAscTypeSelectElement.Image) {
                    if (object.get_ObjectValue() && object.get_ObjectValue().get_ShapeProperties()) {
                        shapes.push(object);
                    }
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
                if (object.get_ObjectType() == Asc.c_oAscTypeSelectElement.Image) {
                    const imageObject = object.get_ObjectValue();
                    if (imageObject && imageObject.get_ShapeProperties() === null && imageObject.get_ChartProperties() === null) {
                        images.push(object);
                    }
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
                if (object.get_ObjectValue() && object.get_ObjectValue().get_ChartProperties()) {
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

EditorUIController.initEditorStyles = (storeParagraphSettings) => {
    const api = Common.EditorApi.get();

    api.asc_setParagraphStylesSizes(330, 38);
    api.asc_registerCallback('asc_onInitEditorStyles', (styles) => {
        storeParagraphSettings.initEditorStyles(styles);
    });
    api.asc_registerCallback('asc_onParaStyleName', (name) => {
        storeParagraphSettings.changeParaStyleName(name);
    });
};

EditorUIController.initTableTemplates = (storeTableSettings) => {
    const api = Common.EditorApi.get();

    api.asc_registerCallback('asc_onInitTableTemplates', () => {
        storeTableSettings.setStyles(api.asc_getTableStylesPreviews(true), 'default');
        storeTableSettings.setStyles(api.asc_getTableStylesPreviews());
    });
};

EditorUIController.updateChartStyles = (storeChartSettings, storeFocusObjects) => {
    const api = Common.EditorApi.get();

    api.asc_registerCallback('asc_onUpdateChartStyles', () => {
        if (storeFocusObjects.chartObject && storeFocusObjects.chartObject.get_ChartProperties()) {
            storeChartSettings.updateChartStyles(
                api.asc_getChartPreviews(storeFocusObjects.chartObject.get_ChartProperties().getType()));
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

        const { canReview, canViewComments, canComments, canCoAuthoring, isDisconnected,
            isProtected, typeProtection } = context.props;

        const api = Common.EditorApi.get();
        const stack = api.getSelectedElements();
        const canCopy = api.can_CopyCut();
        const isAllowedEditing = !isProtected || typeProtection === Asc.c_oAscEDocProtect.TrackedChanges;

        let itemsIcon = [],
            itemsText = [];

        if ( canCopy ) {
            itemsIcon.push({
                event: 'copy',
                icon: IconCopy.id
            });
        }

        let isText = false,
            isTable = false,
            isImage = false,
            isChart = false,
            isShape = false,
            isLink = false,
            lockedText = false,
            lockedTable = false,
            lockedImage = false,
            lockedHeader = false;

        stack.forEach(item => {
            const objectType = item.get_ObjectType(),
                objectValue = item.get_ObjectValue();

            if ( objectType == Asc.c_oAscTypeSelectElement.Header ) {
                lockedHeader = objectValue.get_Locked();
            } else
            if ( objectType == Asc.c_oAscTypeSelectElement.Paragraph ) {
                lockedText = objectValue.get_Locked();
                isText = true;
            } else
            if ( objectType == Asc.c_oAscTypeSelectElement.Image ) {
                lockedImage = objectValue.get_Locked();
                if ( objectValue && objectValue.get_ChartProperties() ) {
                    isChart = true;
                } else
                if ( objectValue && objectValue.get_ShapeProperties() ) {
                    isShape = true;
                } else {
                    isImage = true;
                }
            } else
            if ( objectType == Asc.c_oAscTypeSelectElement.Table ) {
                lockedTable = objectValue.get_Locked();
                isTable = true;
            } else
            if ( objectType == Asc.c_oAscTypeSelectElement.Hyperlink ) {
                isLink = true;
            }
        });

        if ( stack.length > 0 ) {
            const swapItems = function(items, indexBefore, indexAfter) {
                items[indexAfter] = items.splice(indexBefore, 1, items[indexAfter])[0];
            };

            if ( !isDisconnected && isAllowedEditing ) {
                if ( !lockedText && !lockedTable && !lockedImage && !lockedHeader && canCopy ) {
                    itemsIcon.push({
                        event: 'cut',
                        icon: IconCut.id
                    });

                    // Swap 'Copy' and 'Cut'
                    swapItems(itemsIcon, 0, 1);
                }

                if ( !lockedText && !lockedTable && !lockedImage && !lockedHeader ) {
                    itemsIcon.push({
                        event: 'paste',
                        icon: IconPaste.id
                    });
                }

                if ( isTable && api.CheckBeforeMergeCells() && !lockedTable && !lockedHeader) {
                    itemsText.push({
                        caption: _t.menuMerge,
                        event: 'merge'
                    });
                }

                if ( isTable && api.CheckBeforeSplitCells() && !lockedTable && !lockedHeader ) {
                    itemsText.push({
                        caption: _t.menuSplit,
                        event: 'split'
                    });
                }

                if ( !lockedText && !lockedTable && !lockedImage && !lockedHeader ) {
                    itemsText.push({
                        caption: _t.menuDelete,
                        event: 'delete'
                    });
                }

                if ( isTable && !lockedTable && !lockedText && !lockedHeader ) {
                    itemsText.push({
                        caption: _t.menuDeleteTable,
                        event: 'deletetable'
                    });
                }

                if ( !lockedText && !lockedTable && !lockedImage && !lockedHeader ){
                    itemsText.push({
                        caption: _t.menuEdit,
                        event: 'edit'
                    });
                }

                if ( !!api.can_AddHyperlink() && !lockedHeader) {
                    itemsText.push({
                        caption: _t.menuAddLink,
                        event: 'addlink'
                    });
                }

                if ( canReview ) {
                    if (context.inRevisionChange) {
                        itemsText.push({
                            caption: _t.menuReviewChange,
                            event: 'reviewchange'
                        });
                    } else {
                        itemsText.push({
                            caption: _t.menuReview,
                            event: 'review'
                        });
                    }
                }

                if ( context.isComments && canViewComments ) {
                    itemsText.push({
                        caption: _t.menuViewComment,
                        event: 'viewcomment'
                    });
                }

                const isObject = isShape || isChart || isImage || isTable;
                const hideAddComment = !canViewComments || !canComments || !canCoAuthoring ||
                    api.can_AddQuotedComment() === false || lockedText || lockedTable ||
                    lockedImage || lockedHeader || (!isText && isObject);
                if ( !hideAddComment ) {
                    itemsText.push({
                        caption: _t.menuAddComment,
                        event: 'addcomment'
                    });
                }
            }
        }

        if ( isLink ) {
            itemsText.push({
                caption: _t.menuOpenLink,
                event: 'openlink'
            });

            if ( isAllowedEditing ) {
                itemsText.push({
                    caption: t('ContextMenu.menuEditLink'),
                    event: 'editlink'
                });
            }
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
            case 'merge':
                api.MergeCells();
                return true;
            case 'split':
                context.showSplitModal();
                return true;
            case 'delete':
                api.asc_Remove();
                return true;
            case 'deletetable':
                api.remTable();
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
            case 'editlink':
                setTimeout(() => {
                    context.props.openOptions('edit-link');
                }, 0);
                return true;
        }

        return false;
    },
};

export default EditorUIController;
