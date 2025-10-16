/**
 * Build the icons json library
 * ----------------------------
 */

const { consola } = require( 'consola' );
consola.start( 'RUN   : make:icons' );
consola.info( 'BUILD : Generate editor button icons library (scss, js, php)' );

const fs = require( 'fs' );
const path = require( 'path' );

const svgDir = path.join( __dirname, '..', 'icons/svg' );
const jsFile = path.join( __dirname, '..', 'icons/icons.build.js' );
const readmeFile = path.join( __dirname, '..', 'cli/readme.js' );

function getAllSvgFiles( dir ) {
	let results = [];
	const list = fs.readdirSync( dir );
	list.forEach( ( file ) => {
		const filePath = path.join( dir, file );
		const stat = fs.statSync( filePath );
		if ( stat && stat.isDirectory() ) {
			results = results.concat( getAllSvgFiles( filePath ) );
		} else if ( file.endsWith( '.svg' ) ) {
			results.push( filePath );
		}
	} );
	return results;
}

const svgFiles = getAllSvgFiles( svgDir );

// Open file
let iconsLibrary = '{\n';

svgFiles.forEach( ( filePath, index ) => {
	let iconSet = '';
	let fileContent = fs.readFileSync( filePath, 'utf8' );

	// replace " with '
	fileContent = fileContent.replace( /"/g, "'" );

	// remove line break
	fileContent = fileContent.replace( /\n/g, '' );

	const slug = path.basename( filePath, '.svg' );

	let label = '';
	label = path.basename( filePath, '.svg' );
	label = label.replace( /-/g, ' ' );
	label = label.replace( /\b\w/g, ( l ) => l.toUpperCase() );

	let coma = ',';
	coma = index === svgFiles.length - 1 ? '' : coma;

	// Set
	iconSet =
		'{\n' +
		'\t"label" : "' +
		label +
		'",\n' +
		'\t"slug"  : "' +
		slug +
		'",\n' +
		'\t"svg"   : "' +
		fileContent +
		'"' +
		'\n}';

	// Add
	iconSet = '"' + slug + '" : ' + iconSet + coma + '\n';

	// Add Tab to each line
	iconSet = iconSet
		.split( '\n' )
		.map( ( line ) => '\t' + line )
		.join( '\n' );

	// Insert
	iconsLibrary += `\n${ iconSet }`;
} );

// Close file
iconsLibrary += '\n' + '}';

// Comments
const fileComments = fs.readFileSync( readmeFile, 'utf8' );

// Write .json
const jsContent =
	fileComments +
	'\n\n' +
	'const icons = ' +
	iconsLibrary +
	';\n\nexport { icons } ;';
fs.writeFileSync( jsFile, jsContent, 'utf8' );

// Write .php
let phpContent = iconsLibrary;
// replace { with [
phpContent = phpContent.replace( /{/g, '[' );
// replace } with ]
phpContent = phpContent.replace( /}/g, ']' );
// replace : by =>
phpContent = phpContent.replace( /:/g, '=>' );
// replace http=>// with http://
phpContent = phpContent.replace( /http=>\/\//g, 'http://' );
// add return
phpContent = '<?php' + '\n' + fileComments + '\n\nreturn ' + phpContent + ';';

const phpFile = path.join( __dirname, '..', 'icons/icons.build.php' );
fs.writeFileSync( phpFile, phpContent, 'utf8' );

// Write .scss
let scssContent = iconsLibrary;
// replace { with (
scssContent = scssContent.replace( /{/g, '(' );
// repalce } with  )
scssContent = scssContent.replace( /}/g, ')' );
// set $buttonIcons
scssContent = fileComments + '\n\n $buttonIcons : ' + scssContent + ';';

const scssFile = path.join( __dirname, '..', 'icons/icons.build.scss' );
fs.writeFileSync( scssFile, scssContent, 'utf8' );

consola.success( 'DONE\n' );
