/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';

/**
 * External dependencies
 */
import classnames from 'classnames';


/**
 * Add icon and position classes in the Editor.
 *
 * @since 0.1.0
 * @param {Object} BlockListBlock
 */
function addClasses( BlockListBlock ) {
	return ( props ) => {
		const { name, attributes } = props;

		if ( 'core/button' !== name || ! attributes?.icon ) {
			return <BlockListBlock { ...props } />;
		}

		const classes = classnames( props?.className, {
			'has-icon': attributes?.icon,
			[ `has-icon-${ attributes?.icon }` ]: attributes?.icon,
			'has-icon-position-left': attributes?.iconPositionLeft,
		} );

		return <BlockListBlock { ...props } className={ classes } />;
	};
}

addFilter(
	'editor.BlockListBlock',
	'button-icons/add-classes',
	addClasses
);