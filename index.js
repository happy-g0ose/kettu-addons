(() => {
  const ReactNative = vendetta.metro.common.ReactNative;
  const LayoutAnimation = ReactNative && ReactNative.LayoutAnimation;
  const instead = vendetta.patcher.instead;
  let unpatch;
  let active = false;

  function tuneConfig(config) {
    if (!config || typeof config !== "object" || Array.isArray(config)) return config;

    const transitions = [config.create, config.update, config.delete];
    for (const transition of transitions) {
      if (transition && typeof transition === "object" && transition.type === "keyboard") {
        return config;
      }
    }

    const configuredDuration = Number.isFinite(config.duration) ? config.duration : 300;
    const tuned = Object.assign({}, config, {
      duration: Math.max(configuredDuration, 380)
    });

    for (const key of ["create", "update", "delete"]) {
      const transition = tuned[key];
      if (!transition || typeof transition !== "object" || Array.isArray(transition)) continue;
      if (transition.type === undefined || transition.type === "linear") {
        tuned[key] = Object.assign({}, transition, { type: "easeInEaseOut" });
      }
    }

    return tuned;
  }

  return {
    onLoad() {
      if (active) return;

      if (!LayoutAnimation || typeof LayoutAnimation.configureNext !== "function") {
        vendetta.logger.error("Kettu Summary Easing: React Native LayoutAnimation.configureNext was not found.");
        return;
      }

      try {
        unpatch = instead("configureNext", LayoutAnimation, function (args, original) {
          const forwarded = args.slice();
          forwarded[0] = tuneConfig(forwarded[0]);
          return original.apply(this, forwarded);
        });
        active = true;
        vendetta.logger.log("Kettu Summary Easing: LayoutAnimation transitions use a 380 ms minimum duration.");
      } catch (error) {
        if (typeof unpatch === "function") unpatch();
        unpatch = undefined;
        active = false;
        vendetta.logger.error("Kettu Summary Easing: failed to patch LayoutAnimation.configureNext.", error);
      }
    },

    onUnload() {
      const dispose = unpatch;
      unpatch = undefined;
      active = false;
      if (typeof dispose === "function") dispose();
    }
  };
})()
