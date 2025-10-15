<?php

namespace MXP\ButtonIcons\Core;

final class App extends Plugin {

	private array $features = [];

	/**
	 * Load the plugin
	 *
	 * @return void
	 */
	public function load() {
		add_action( 'plugins_loaded', [ $this, 'init' ] );
	}

	/**
	 * Init the plugin
	 *
	 * @return void
	 */
	public function init(){
		add_action('init', [ $this, 'loadTranslations' ]);
		add_action('init', [ $this, 'buttonIconsStyles' ]);
		add_action( 'enqueue_block_editor_assets', [ $this, 'editorEnqueues' ] );
		// add_action( 'wp_enqueue_scripts', [ $this, 'frontEnqueues' ] );
		add_action( 'render_block_core/button', [ $this, 'customizeButtonBlock' ], 10, 2 );
	}


	/**
	 * Get Translations
	 *
	 * @return void
	 */
	public function loadTranslations(){
		$locale = get_user_locale();
		$locale = apply_filters( 'plugin_locale', $locale, 'button-icons' );
		load_textdomain( 'button-icons', WP_LANG_DIR . '/plugins/button-icons-' . $locale . '.mo' );
		load_plugin_textdomain( 'button-icons', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}


	/**
	 * Enqueue block editor assets.
	 */
	public function editorEnqueues(){

		if( ! is_admin() ){
			return ;
		}

		$plugin_path = untrailingslashit( $this->directoryPath );
		$pluginUrl   = untrailingslashit( $this->pluginUrl );

		$asset_file  = include untrailingslashit( $plugin_path ) . '/dist/editor.asset.php';

		wp_enqueue_script(
			'button-icons-editor-scripts',
			$pluginUrl . '/dist/editor.js',
			$asset_file['dependencies'],
			$asset_file['version']
		);

		wp_set_script_translations(
			'button-icons-editor-scripts',
			'button-icons',
			$plugin_path . '/languages'
		);

		wp_enqueue_style(
			'button-icons-editor-styles',
			$pluginUrl . '/dist/editor.css'
		);
	}


	/**
	 * Frontend Enqueues
	 *
	 * @return void
	 */
	// public function frontEnqueues(){
	// 	$plugin_path = untrailingslashit( $this->directoryPath );
	// }

	public function buttonIconsStyles(){

		$plugin_path = untrailingslashit( $this->directoryPath );
		$pluginUrl   = untrailingslashit( $this->pluginUrl );

		wp_enqueue_block_style(
			'core/button',
			array(
				'handle' => 'button-icons-block-style',
				'src'    => $pluginUrl . '/dist/button-icons.css',
				'ver'    => filemtime( $plugin_path . '/dist/button-icons.css' ),
				'path'   => $plugin_path . '/dist/button-icons.css',
			)
		);
	}


	public function customizeButtonBlock( $block_content, $block ) {

		if ( ! isset( $block['attrs']['icon'] ) ) {
			return $block_content;
		}

		$icon         = $block['attrs']['icon'];
		$positionLeft = isset( $block['attrs']['iconPositionLeft'] ) ? $block['attrs']['iconPositionLeft'] : false;
		
		// Bail if $iconsFile don't exists
		$iconsFile = untrailingslashit( $this->directoryPath ) . '/dist/icons/icons.build.php';
		if ( ! file_exists( $iconsFile ) ) {
			return $block_content;
		}
		
		
		// Make sure the selected icon is in the array, otherwise define default icon.
		$icons = (array) include $iconsFile ;
		if ( ! array_key_exists( $icon, $icons ) ) {
			$icon = 'arrow-right';
		}

		// Append the icon class to the block.
		$p = new \WP_HTML_Tag_Processor( $block_content );
		if ( $p->next_tag() ) {
			$p->add_class( 'has-icon' );
			$p->add_class( 'has-icon--' . $icon );
			if( $positionLeft ){
				$p->add_class( 'has-icon-position-left' );
			} else {
				$p->add_class( 'has-icon-position-right' );
			}
		}
		$block_content = $p->get_updated_html();

		// Add the SVG icon either to the left of right of the button text.
		$block_content = $positionLeft
			? preg_replace( '/(<a[^>]*>)(.*?)(<\/a>)/i', '$1<span class="wp-block-button__link-icon" aria-hidden="true">' . $icons[ $icon ][ 'svg' ] . '</span>$2$3', $block_content )
			: preg_replace( '/(<a[^>]*>)(.*?)(<\/a>)/i', '$1$2<span class="wp-block-button__link-icon" aria-hidden="true">' . $icons[ $icon ][ 'svg' ] . '</span>$3', $block_content );

		return $block_content;
	}
}