/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	PanelRow,
	ToggleControl,
	__experimentalGrid as Grid, // eslint-disable-line
} from '@wordpress/components';



/**
 * All available icons.
 * (Order determines presentation order)
 */

import { icons as iconsLibrary } from '../icons/icons.build.js';

export const ICONS = Object.entries(iconsLibrary).map(([key, value]) => {
	return {
		label: value.label,
		value: value.slug,
		icon: <span dangerouslySetInnerHTML={{ __html: value.svg }} />
	}
});




/**
 * Filter the BlockEdit object and add icon inspector controls to button blocks.
 *
 * @since 0.1.0
 * @param {Object} BlockEdit
 */
function addInspectorControls( BlockEdit ) {
	return ( props ) => {
		if ( props.name !== 'core/button' ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes } = props;
		const { icon: currentIcon, iconPositionLeft } = attributes;

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="styles">
					<PanelBody
						title={ __( 'Icon', 'quantis-2024' ) }
						className="button-icon-picker"
						initialOpen={ true }
					>
						<PanelRow>
							<Grid
								className="button-icon-picker__grid"
								columns="5"
								gap="0"
							>
								{ ICONS.map( ( icon, index ) => (
									<Button
										key={ index }
										label={ icon?.label }
										isPressed={ currentIcon === icon.value }
										className="button-icon-picker__button"
										onClick={ () =>
											setAttributes( {
												// Allow user to disable icons.
												icon:
													currentIcon === icon.value
														? null
														: icon.value,
											} )
										}
									>
										{ icon.icon ?? icon.value }
									</Button>
								) ) }
							</Grid>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={ __(
									'Show icon on left',
									'quantis-2024'
								) }
								checked={ iconPositionLeft }
								onChange={ () => {
									setAttributes( {
										iconPositionLeft: ! iconPositionLeft,
									} );
								} }
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}

addFilter(
	'editor.BlockEdit',
	'button-icons/add-inspector-controls',
	addInspectorControls
);

