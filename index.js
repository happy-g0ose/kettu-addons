(() => {
    const MIN_LAYOUT_DURATION = 320;
    const MIN_TIMING_DURATION = 260;

    const unpatches = [];
    let started = false;

    const isPlainObject = value =>
        value !== null && typeof value === "object" && !Array.isArray(value);

    const finiteOr = (value, fallback) => (Number.isFinite(value) ? value : fallback);

    function usesKeyboardAnimation(config) {
        if (!isPlainObject(config)) return false;
        if (config.type === "keyboard") return true;

        for (const key of ["create", "update", "delete"]) {
            const step = config[key];
            if (isPlainObject(step) && step.type === "keyboard") return true;
        }

        return false;
    }

    function tuneLayoutConfig(config) {
        if (!isPlainObject(config) || usesKeyboardAnimation(config)) return config;

        const tuned = Object.assign({}, config, {
            duration: Math.max(finiteOr(config.duration, 300), MIN_LAYOUT_DURATION)
        });

        for (const key of ["create", "update", "delete"]) {
            const step = config[key];
            if (!isPlainObject(step)) continue;

            const tunedStep = Object.assign({}, step);

            if (Number.isFinite(tunedStep.duration)) {
                tunedStep.duration = Math.max(tunedStep.duration, MIN_LAYOUT_DURATION);
            }

            if (tunedStep.type === undefined || tunedStep.type === "linear") {
                tunedStep.type = "easeInEaseOut";
            }

            tuned[key] = tunedStep;
        }

        return tuned;
    }

    function tuneTimingConfig(config) {
        if (!isPlainObject(config)) return config;
        if (!Number.isFinite(config.duration)) return config;
        if (config.duration >= MIN_TIMING_DURATION) return config;

        return Object.assign({}, config, { duration: MIN_TIMING_DURATION });
    }

    function patchInstead(key, parent, callback) {
        try {
            const unpatch = vendetta.patcher.instead(key, parent, callback);
            if (typeof unpatch === "function") unpatches.push(unpatch);
        } catch (error) {
            vendetta.logger.error(`Smoother UI: unable to patch ${key}`, error);
        }
    }

    return {
        onLoad() {
            if (started) return;

            let patched = 0;

            try {
                const reactNative = vendetta.metro.common.ReactNative;

                const layoutAnimation = reactNative && reactNative.LayoutAnimation;
                if (layoutAnimation && typeof layoutAnimation.configureNext === "function") {
                    const before = unpatches.length;
                    patchInstead("configureNext", layoutAnimation, (args, original) => {
                        const forwarded = args.slice();
                        forwarded[0] = tuneLayoutConfig(forwarded[0]);
                        return original(...forwarded);
                    });
                    if (unpatches.length > before) patched++;
                }

                const animated = reactNative && reactNative.Animated;
                if (animated && typeof animated.timing === "function") {
                    const before = unpatches.length;
                    patchInstead("timing", animated, (args, original) => {
                        const forwarded = args.slice();
                        forwarded[1] = tuneTimingConfig(forwarded[1]);
                        return original(...forwarded);
                    });
                    if (unpatches.length > before) patched++;
                }
            } catch (error) {
                vendetta.logger.error("Smoother UI: React Native module is unavailable", error);
            }

            if (patched === 0) {
                vendetta.logger.warn("Smoother UI: no supported animation entry point was found");
                return;
            }

            started = true;
            vendetta.logger.log(`Smoother UI: patched ${patched} animation entry point(s)`);
        },

        onUnload() {
            started = false;

            while (unpatches.length) {
                const unpatch = unpatches.pop();
                try {
                    unpatch();
                } catch (error) {
                    vendetta.logger.error("Smoother UI: failed to remove a patch", error);
                }
            }
        }
    };
})()
