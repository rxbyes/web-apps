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

/*
 * Community Edition implementation of the mobile spreadsheet editor glue
 * layer (EditorUIController). Upstream keeps the real implementation in the
 * private repository `web-apps-mobile/cell` and ships an inert stub in the
 * open-source tree; this file restores the functionality from the last open
 * revisions (7c72e8cb1b^, 588a7f0386^, cfbb8ce795) adapted to the current
 * API surface.
 */

const EditorUIController = () => {
    return null
};

EditorUIController.isSupportEditFeature = () => {
    return true
};

EditorUIController.toolbarOptions = {
    getEditOptions: (opts = {}) => {
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
    },

    getUndoRedo: (opts = {}) => {
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
    }
};

EditorUIController.initThemeColors = () => {
    const api = Common.EditorApi.get();

    api.asc_registerCallback('asc_onSendThemeColors', (colors, standart_colors) => {
        Common.Utils.ThemeColor.setColors(colors, standart_colors);
    });
};

EditorUIController.initCellInfo = (props) => {
    const api = Common.EditorApi.get();

    const storeFocusObjects = props.storeFocusObjects;
    const storeCellSettings = props.storeCellSettings;
    const storeTextSettings = props.storeTextSettings;
    const storeChartSettings = props.storeChartSettings;

    storeFocusObjects.intf = {
        getSelections: () => {
            const _selections = [];

            let isCell, isRow, isCol, isAll, isChart, isImage, isTextShape, isShape, isTextChart,
                selType = storeFocusObjects._cellInfo.asc_getSelectionType();

            switch (selType) {
                case Asc.c_oAscSelectionType.RangeCells:    isCell  = true; break;
                case Asc.c_oAscSelectionType.RangeRow:      isRow   = true; break;
                case Asc.c_oAscSelectionType.RangeCol:      isCol   = true; break;
                case Asc.c_oAscSelectionType.RangeMax:      isAll   = true; break;
                case Asc.c_oAscSelectionType.RangeImage:    isImage = true; break;
                case Asc.c_oAscSelectionType.RangeShape:    isShape = true; break;
                case Asc.c_oAscSelectionType.RangeChart:    isChart = true; break;
                case Asc.c_oAscSelectionType.RangeChartText:isTextChart = true; break;
                case Asc.c_oAscSelectionType.RangeShapeText: isTextShape = true; break;
            }

            if (isImage || isShape || isChart) {
                isImage = isShape = isChart = false;
                const selectedObjects = Common.EditorApi.get().asc_getGraphicObjectProps();

                for (let i = 0; i < selectedObjects.length; i++) {
                    if (selectedObjects[i].asc_getObjectType() == Asc.c_oAscTypeSelectElement.Image) {
                        const elValue = selectedObjects[i].asc_getObjectValue();
                        const shapeProps = elValue.asc_getShapeProperties();

                        if (shapeProps) {
                            if (shapeProps.asc_getFromChart()) {
                                isChart = true;
                            } else {
                                isShape = true;
                            }
                        } else if (elValue.asc_getChartProperties()) {
                            isChart = true;
                        } else {
                            isImage = true;
                        }
                    }
                }
            } else if (isTextShape || isTextChart) {
                const selectedObjects = Common.EditorApi.get().asc_getGraphicObjectProps();

                for (let i = 0; i < selectedObjects.length; i++) {
                    const elType = selectedObjects[i].asc_getObjectType();
                    if (elType == Asc.c_oAscTypeSelectElement.Image) {
                        // object locked state is handled by the store
                    } else if (elType == Asc.c_oAscTypeSelectElement.Paragraph) {
                    } else if (elType == Asc.c_oAscTypeSelectElement.Math) {
                    }
                }
            }

            if (isChart || isTextChart) {
                _selections.push('chart');

                if (isTextChart) {
                    _selections.push('text');
                }
            } else if ((isShape || isTextShape) && !isImage) {
                _selections.push('shape');

                if (isTextShape) {
                    _selections.push('text');
                }
            } else if (isImage) {
                _selections.push('image');

                if (isShape) {
                    _selections.push('shape');
                }
            } else {
                _selections.push('cell');

                if (storeFocusObjects._cellInfo.asc_getHyperlink()) {
                    _selections.push('hyperlink');
                }
            }
            return _selections;
        },
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
                if (object.get_ObjectType() === Asc.c_oAscTypeSelectElement.Image) {
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
                if (object.get_ObjectType() === Asc.c_oAscTypeSelectElement.Image) {
                    if (object.get_ObjectValue() && object.get_ObjectValue().get_ChartProperties()) {
                        charts.push(object);
                    }
                }
            }
            if (charts.length > 0) {
                const object = charts[charts.length - 1]; // get top
                return object.get_ObjectValue();
            } else {
                return undefined;
            }
        },
        getParagraphObject: () => {
            const paragraphs = [];
            for (let object of storeFocusObjects._focusObjects) {
                if (object.get_ObjectType() === Asc.c_oAscTypeSelectElement.Paragraph) {
                    paragraphs.push(object);
                }
            }
            if (paragraphs.length > 0) {
                const object = paragraphs[paragraphs.length - 1]; // get top
                return object.get_ObjectValue();
            } else {
                return undefined;
            }
        },
    };

    api.asc_registerCallback('asc_onSelectionChanged', cellInfo => {
        storeFocusObjects.resetCellInfo(cellInfo);
        storeCellSettings.initCellSettings(cellInfo);
        storeTextSettings.initTextSettings(cellInfo);
        storeFocusObjects.changeFocus(false);

        let selectedObjects = api.asc_getGraphicObjectProps();

        if (selectedObjects.length) {
            storeFocusObjects.resetFocusObjects(selectedObjects);
            storeFocusObjects.changeFocus(true);

            // Chart Settings

            if (storeFocusObjects.chartObject) {
                storeChartSettings.updateChartStyles(
                    api.asc_getChartPreviews(storeFocusObjects.chartObject.get_ChartProperties().getType()));
            }
        }
    });
};

EditorUIController.initEditorStyles = (storeCellSettings) => {
    const api = Common.EditorApi.get();

    api.asc_registerCallback('asc_onInitEditorStyles', styles => {
        storeCellSettings.initCellStyles(styles);
    });
};

EditorUIController.initFonts = (props) => {
    const api = Common.EditorApi.get();

    const storeCellSettings = props.storeCellSettings;
    const storeTextSettings = props.storeTextSettings;

    api.asc_registerCallback('asc_onInitEditorFonts', (fonts, select) => {
        storeCellSettings.initEditorFonts(fonts, select);
        storeTextSettings.initEditorFonts(fonts, select);
    });

    api.asc_registerCallback('asc_onEditorSelectionChanged', fontObj => {
        storeCellSettings.initFontInfo(fontObj);
        storeTextSettings.initFontInfo(fontObj);
    });
};

EditorUIController.ContextMenu = {
    mapMenuItems: (context) => {
        const { t } = context.props;
        const _t = t("ContextMenu", { returnObjects: true });

        const { canViewComments, isDisconnected } = context.props;

        const api = Common.EditorApi.get();
        const cellinfo = api.asc_getCellInfo();

        const itemsIcon = [];
        const itemsText = [];

        let iscellmenu, isrowmenu, iscolmenu, isallmenu, ischartmenu, isimagemenu, istextshapemenu, isshapemenu, istextchartmenu;
        let iscelllocked = cellinfo.asc_getLocked();
        const seltype = cellinfo.asc_getSelectionType();
        const xfs = cellinfo.asc_getXfs();
        const isComments = cellinfo.asc_getComments().length > 0; //prohibit adding multiple comments in one cell;

        switch (seltype) {
            case Asc.c_oAscSelectionType.RangeCells:     iscellmenu  = true;     break;
            case Asc.c_oAscSelectionType.RangeRow:       isrowmenu   = true;     break;
            case Asc.c_oAscSelectionType.RangeCol:       iscolmenu   = true;     break;
            case Asc.c_oAscSelectionType.RangeMax:       isallmenu   = true;     break;
            case Asc.c_oAscSelectionType.RangeImage:     isimagemenu = true;     break;
            case Asc.c_oAscSelectionType.RangeShape:     isshapemenu = true;     break;
            case Asc.c_oAscSelectionType.RangeChart:     ischartmenu = true;     break;
            case Asc.c_oAscSelectionType.RangeChartText: istextchartmenu = true; break;
            case Asc.c_oAscSelectionType.RangeShapeText: istextshapemenu = true; break;
        }

        if (!isDisconnected) {
            if (!iscelllocked && (isimagemenu || isshapemenu || ischartmenu || istextshapemenu || istextchartmenu)) {
                api.asc_getGraphicObjectProps().every((object) => {
                    if (object.asc_getObjectType() == Asc.c_oAscTypeSelectElement.Image) {
                        iscelllocked = object.asc_getObjectValue().asc_getLocked();
                    }
                    return !iscelllocked;
                });
            }

            if (iscelllocked || api.isCellEdited) {
                itemsIcon.push({
                    event: 'copy',
                    icon: IconCopy.id
                });
            } else {
                itemsIcon.push({
                    event: 'cut',
                    icon: IconCut.id
                });
                itemsIcon.push({
                    event: 'copy',
                    icon: IconCopy.id
                });
                itemsIcon.push({
                    event: 'paste',
                    icon: IconPaste.id
                });
                itemsText.push({
                    caption: _t.menuDelete,
                    event: 'del'
                });

                if (isimagemenu || isshapemenu || ischartmenu ||
                    istextshapemenu || istextchartmenu) {
                    itemsText.push({
                        caption: _t.menuEdit,
                        event: 'edit'
                    });
                } else {
                    if (iscolmenu || isrowmenu) {
                        itemsText.push({
                            caption: _t.menuHide,
                            event: 'hide'
                        });
                        itemsText.push({
                            caption: _t.menuShow,
                            event: 'show'
                        });
                    } else if (iscellmenu) {
                        if (!iscelllocked) {
                            itemsText.push({
                                caption: _t.menuCell,
                                event: 'edit'
                            });
                        }

                        if (cellinfo.asc_getMerge() == Asc.c_oAscMergeOptions.None) {
                            itemsText.push({
                                caption: _t.menuMerge,
                                event: 'merge'
                            });
                        }

                        if (cellinfo.asc_getMerge() == Asc.c_oAscMergeOptions.Merge) {
                            itemsText.push({
                                caption: _t.menuUnmerge,
                                event: 'unmerge'
                            });
                        }

                        itemsText.push(
                            xfs.asc_getWrapText() ?
                                {
                                    caption: _t.menuUnwrap,
                                    event: 'unwrap'
                                } :
                                {
                                    caption: _t.menuWrap,
                                    event: 'wrap'
                                });

                        if (cellinfo.asc_getHyperlink() && !cellinfo.asc_getMultiselect()) {
                            itemsText.push({
                                caption: _t.menuOpenLink,
                                event: 'openlink'
                            });

                            itemsText.push({
                                caption: t("ContextMenu.menuEditLink"),
                                event: 'editlink'
                            });
                        } else if (!cellinfo.asc_getHyperlink() && !cellinfo.asc_getMultiselect() &&
                            !cellinfo.asc_getLockText() && !!cellinfo.asc_getText()) {
                            itemsText.push({
                                caption: _t.menuAddLink,
                                event: 'addlink'
                            });
                        }
                    }

                    itemsText.push({
                        caption: api.asc_getSheetViewSettings().asc_getIsFreezePane() ? _t.menuUnfreezePanes : _t.menuFreezePanes,
                        event: 'freezePanes'
                    });
                }

                if (canViewComments) {
                    if (isComments) {
                        itemsText.push({
                            caption: _t.menuViewComment,
                            event: 'viewcomment'
                        });
                    } else if (iscellmenu) {
                        itemsText.push({
                            caption: _t.menuAddComment,
                            event: 'addcomment'
                        });
                    }
                }
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
        const info = api.asc_getCellInfo();

        switch (action) {
            case 'addcomment':
                Common.Notifications.trigger('addcomment');
                return true;
            case 'del':
                api.asc_emptyCells(Asc.c_oAscCleanOptions.All);
                return true;
            case 'wrap':
                api.asc_setCellTextWrap(true);
                return true;
            case 'unwrap':
                api.asc_setCellTextWrap(false);
                return true;
            case 'edit':
                setTimeout(() => {
                    context.props.openOptions('edit');
                }, 0);
                return true;
            case 'merge':
                context.onMergeCells();
                return true;
            case 'unmerge':
                api.asc_mergeCells(Asc.c_oAscMergeOptions.None);
                return true;
            case 'hide':
                api[info.asc_getSelectionType() == Asc.c_oAscSelectionType.RangeRow ? 'asc_hideRows' : 'asc_hideColumns']();
                return true;
            case 'show':
                api[info.asc_getSelectionType() == Asc.c_oAscSelectionType.RangeRow ? 'asc_showRows' : 'asc_showColumns']();
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
            case 'freezePanes':
                api.asc_freezePane();
                return true;
        }

        return false;
    },
};

export default EditorUIController;
