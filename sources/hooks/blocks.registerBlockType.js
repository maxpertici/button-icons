/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';

/**
 * Add the attributes needed for button icons.
 *
 * @since 0.1.0
 * @param {Object} settings
 */
function addAttributes( settings ) {
	if ( 'core/button' !== settings.name ) {
		return settings;
	}

	// Add the block visibility attributes.
	const iconAttributes = {
		icon: {
			type: 'string',
		},
		iconPositionLeft: {
			type: 'boolean',
			default: false,
		},
	};

	const newSettings = {
		...settings,
		attributes: {
			...settings.attributes,
			...iconAttributes,
		},
	};

	return newSettings;
}

addFilter(
	'blocks.registerBlockType',
	'button-icons/add-attributes',
	addAttributes
);
