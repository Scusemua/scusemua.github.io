const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

/** @type {import('next').NextConfig} */
module.exports = {
    /**
     * Enable static exports for the App Router.
     *
     * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
     */
    output: "export",

    /**
     * Set base path. This is the slug of your GitHub repository.
     *
     * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
     */
    basePath: "",

    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {

        if( !dev ) {
            // remove existing instance of CssMinimizerPlugin
            config.optimization.minimizer = config.optimization.minimizer.filter( minimizer => {
                return minimizer.constructor.name !== 'CssMinimizerPlugin';
            });


            // create new instance of CssMinimizerPlugin
            // minimizerOptions === cssnano config
            const minifyCssPlugin = new CssMinimizerPlugin({
                minimizerOptions: {
                    // your cssnano configuration
                    preset: [
                        'default',
                        {
                            mergeLonghand: false,
                            mergeRules: false,
                        },
                    ],
                },
            });

            config.optimization.minimizer.push( minifyCssPlugin );

            const terserJsPlugin = new TerserJSPlugin({});
            config.optimization.minimizer.push( terserJsPlugin );
        }

        return config;
    },

    /**
     * Disable server-based image optimization. Next.js does not support
     * dynamic features with static exports.
     *
     * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
     */
    images: {
        unoptimized: true,
    },
};