
export interface GuideStep {
  title: string;
  body: string;
}

export interface GuideProblem {
  problem: string;
  fix: string;
}

export interface GuideReference {
  label: string;
  url: string;
}

export interface Guide {
  slug: string;
  title: string;
  objective: string;
  supportedDevices: string[];
  prerequisites: string[];
  steps: GuideStep[];
  expectedOutcome: string;
  commonProblems: GuideProblem[];
  officialReferences: GuideReference[];
  image: string;
  imageAlt: string;
}

export const GUIDES: Guide[] = [
  {
    slug: "screen-time-management",
    title: "Guide 1: Screen Time Management",
    objective:
      "Set up usage dashboards and app timers so you can see — and start limiting — how much time you spend on distracting apps.",

    supportedDevices: ["Android", "iOS", "iPadOS"],

    prerequisites: [
      "A phone running Android 9+ or a supported iOS version",
      "5 minutes of uninterrupted setup time",
    ],

    image: "/guides/screen-time.png",
    imageAlt: "Screen time management and digital wellbeing illustration",

    steps: [
      {
        title: "Open your device's built-in dashboard",
        body:
          "On Android, go to Settings → Digital Wellbeing & parental controls. On iPhone, go to Settings → Screen Time.",
      },
      {
        title: "Review your current usage",
        body:
          "Look at the dashboard for a few days before setting limits, so your limits are based on your real habits rather than a guess.",
      },
      {
        title: "Set an app timer or App Limit",
        body:
          "Android: tap an app in the dashboard and set a daily timer. iOS: Screen Time → App Limits → Add Limit, then choose an app category and a daily time.",
      },
      {
        title: "Set up Downtime or scheduled restrictions",
        body:
          "iOS: Screen Time → Downtime lets you schedule hours where only allowed apps work. Android's equivalent is a Focus Mode schedule.",
      },
      {
        title: "Check your stats weekly",
        body:
          "Revisit the dashboard every week and adjust limits up or down based on what's actually working.",
      },
    ],

    expectedOutcome:
      "You'll have a visible daily/weekly usage total and at least one configured limit on your most time-consuming distracting app.",

    commonProblems: [
      {
        problem: "I don't see a Digital Wellbeing option in Settings.",
        fix:
          "Some manufacturers rename or relocate it. Search Settings for 'wellbeing' or 'screen time', or check your Android version.",
      },
      {
        problem: "I keep bypassing my own App Limit.",
        fix:
          "On iOS, consider setting a separate Screen Time passcode to make ignoring limits less convenient.",
      },
    ],

    officialReferences: [
      {
        label: "Google: Digital Wellbeing overview",
        url: "https://support.google.com/android/answer/9346420",
      },
      {
        label: "Apple: Set up Screen Time",
        url: "https://support.apple.com/en-us/HT208982",
      },
    ],
  },

  {
    slug: "healthy-bedtime-routine",
    title: "Guide 2: Healthy Bedtime Routine",

    objective:
      "Use built-in bedtime tools to automatically quiet your phone and reduce stimulating screen activity before sleep.",

    supportedDevices: ["Android", "iOS"],

    prerequisites: [
      "A configured sleep schedule or a target bedtime in mind",
      "A smartphone supporting bedtime or sleep scheduling features",
    ],

    image: "/guides/bedtime.png",
    imageAlt: "Healthy bedtime routine and sleep focus illustration",

    steps: [
      {
        title: "Decide on a consistent bedtime window",
        body:
          "Pick a wind-down start time and a wake time. Consistency matters more than the exact hours chosen.",
      },
      {
        title: "Turn on Bedtime Mode or Sleep Focus",
        body:
          "Android: Digital Wellbeing → Bedtime Mode → set a schedule. iOS: set up your sleep schedule in the Health app, then enable Sleep Focus in Settings → Focus.",
      },
      {
        title: "Enable grayscale during wind-down",
        body:
          "Android's Bedtime Mode can switch the display to grayscale automatically, which some students find reduces the pull to keep scrolling.",
      },
      {
        title: "Restrict notifications during sleep hours",
        body:
          "Both platforms let you silence notifications during scheduled hours. Confirm that the feature is enabled and configure important contact exceptions.",
      },
      {
        title: "Review the schedule after a week",
        body:
          "Adjust the start time if you're still awake and scrolling after it begins. The schedule only helps if it matches your actual bedtime.",
      },
    ],

    expectedOutcome:
      "Your phone will automatically quiet down and optionally switch to grayscale during your chosen sleep window.",

    commonProblems: [
      {
        problem: "Sleep Focus never turns on automatically.",
        fix:
          "Confirm a sleep schedule is set in the Health app and that Sleep Focus is configured to follow it.",
      },
      {
        problem: "I still get calls during Bedtime Mode.",
        fix:
          "Review your allowed contacts, repeated-call settings, and Do Not Disturb exceptions.",
      },
    ],

    officialReferences: [
      {
        label: "Apple: Use Focus on iPhone",
        url: "https://support.apple.com/en-us/HT212608",
      },
      {
        label: "Google: Digital Wellbeing overview",
        url: "https://support.google.com/android/answer/9346420",
      },
    ],
  },

  {
    slug: "website-distraction-tracker-blocking",
    title: "Guide 3: Website Distraction and Tracker Blocking",

    objective:
      "Install browser extensions to block distracting sites on a schedule and reduce third-party tracking while you browse.",

    supportedDevices: [
      "Windows",
      "macOS",
      "Linux",
      "Chrome",
      "Firefox",
      "Edge",
    ],

    prerequisites: [
      "Firefox, Chrome, or Edge installed",
      "A short list of websites you want to block",
    ],

    image: "/guides/website-blocking.png",
    imageAlt: "Browser distraction blocking and online privacy illustration",

    steps: [
      {
        title: "Choose your browser carefully",
        body:
          "Choose a browser that supports the extensions you want. Firefox supports the full uBlock Origin extension, while Chromium-based browsers have different extension capabilities.",
      },
      {
        title: "Install LeechBlock NG",
        body:
          "Visit proginosko.com/leechblock/ or your browser's extension store, install LeechBlock NG, and open its options page.",
      },
      {
        title: "Add a block set",
        body:
          "Create a named set such as Study Hours, add the domains you want blocked, and configure the days and times when blocking should be active.",
      },
      {
        title: "Install a tracking protection extension",
        body:
          "Install uBlock Origin on supported browsers or consider Privacy Badger. Follow the official extension documentation for configuration.",
      },
      {
        title: "Test your setup",
        body:
          "Visit a blocked site during an active block window to confirm that it is blocked. Check that your privacy extension is enabled.",
      },
    ],

    expectedOutcome:
      "Distracting sites will be restricted during study hours, and browser extensions will help reduce third-party tracking.",

    commonProblems: [
      {
        problem: "uBlock Origin isn't available in my browser store.",
        fix:
          "Check browser compatibility. Firefox supports the full version, while Chrome users can check uBlock Origin Lite.",
      },
      {
        problem: "LeechBlock isn't blocking a site I added.",
        fix:
          "Double-check the domain format, enabled block set, extension permissions, and active schedule.",
      },
    ],

    officialReferences: [
      {
        label: "LeechBlock NG documentation",
        url: "https://www.proginosko.com/leechblock/documentation/",
      },
      {
        label: "uBlock Origin wiki",
        url: "https://github.com/gorhill/uBlock/wiki",
      },
      {
        label: "Privacy Badger",
        url: "https://privacybadger.org/",
      },
    ],
  },
];

export function getGuideBySlug(
  slug: string
): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}















// export interface GuideStep {
//   title: string;
//   body: string;
// }
// export interface GuideProblem {
//   problem: string;
//   fix: string;
// }
// export interface GuideReference {
//   label: string;
//   url: string;
// }
// export interface Guide {
//   slug: string;
//   title: string;
//   objective: string;
//   supportedDevices: string[];
//   prerequisites: string[];
//   steps: GuideStep[];
//   expectedOutcome: string;
//   commonProblems: GuideProblem[];
//   officialReferences: GuideReference[];
//   image: any;
// }

// export const GUIDES: Guide[] = [
//   {
//     slug: "screen-time-management",
//     title: "Guide 1: Screen Time Management",
//     objective:
//       "Set up usage dashboards and app timers so you can see — and start limiting — how much time you spend on distracting apps.",
//     supportedDevices: ["Android", "iOS", "iPadOS"],
//     prerequisites: ["A phone running Android 9+ or iOS 12+", "5 minutes of uninterrupted setup time"],
//     steps: [
//       {
//         title: "Open your device's built-in dashboard",
//         body: "On Android, go to Settings → Digital Wellbeing & parental controls. On iPhone, go to Settings → Screen Time.",
//       },
//       {
//         title: "Review your current usage",
//         body: "Look at the dashboard for a few days before setting limits, so your limits are based on your real habits rather than a guess.",
//       },
//       {
//         title: "Set an app timer or App Limit",
//         body: "Android: tap an app in the dashboard and set a daily timer. iOS: Screen Time → App Limits → Add Limit, then choose an app category and a daily time.",
//       },
//       {
//         title: "Set up Downtime / scheduled restrictions (optional)",
//         body: "iOS: Screen Time → Downtime lets you schedule hours where only allowed apps work. Android's equivalent is a Focus Mode schedule.",
//       },
//       {
//         title: "Check your stats weekly",
//         body: "Revisit the dashboard every week and adjust limits up or down based on what's actually working.",
//       },
//     ],
//     expectedOutcome:
//       "You'll have a visible daily/weekly usage total and at least one enforced limit on your most time-consuming distracting app.",
//     commonProblems: [
//       {
//         problem: "I don't see a Digital Wellbeing option in Settings.",
//         fix: "Some OEM skins rename or relocate it — search Settings for 'wellbeing' or 'screen time', or check that your Android version is 9 or newer.",
//       },
//       {
//         problem: "I keep bypassing my own App Limit.",
//         fix: "iOS lets you require a separate Screen Time passcode that isn't your device passcode — set one so 'Ignore Limit' isn't a one-tap action.",
//       },
//     ],
//     officialReferences: [
//       { label: "Google: Digital Wellbeing overview", url: "https://support.google.com/android/answer/9346420" },
//       { label: "Apple: Set up Screen Time", url: "https://support.apple.com/en-us/HT208982" },
//     ],
//     image:[
//       {url:"/greenheart.svg"}
//     ],
//   },
//   {
//     slug: "healthy-bedtime-routine",
//     title: "Guide 2: Healthy Bedtime Routine",
//     objective:
//       "Use built-in bedtime tools to automatically quiet your phone and reduce stimulating screen light before sleep.",
//     supportedDevices: ["Android", "iOS"],
//     prerequisites: ["A configured sleep schedule (iOS: in the Health app) or a target bedtime in mind"],
//     steps: [
//       {
//         title: "Decide on a consistent bedtime window",
//         body: "Pick a wind-down start time and a wake time — consistency matters more than the exact hours chosen.",
//       },
//       {
//         title: "Turn on Bedtime Mode (Android) or Sleep Focus (iOS)",
//         body: "Android: Digital Wellbeing → Bedtime mode → set a schedule. iOS: set up your sleep schedule in the Health app, then enable the Sleep Focus in Settings → Focus.",
//       },
//       {
//         title: "Enable grayscale during wind-down (optional)",
//         body: "Android's Bedtime Mode can switch the display to grayscale automatically, which some students find reduces the pull to keep scrolling.",
//       },
//       {
//         title: "Restrict notifications during sleep hours",
//         body: "Both Bedtime Mode and Sleep Focus silence notifications by default during the scheduled window — confirm this is turned on, not just scheduled.",
//       },
//       {
//         title: "Review the schedule after a week",
//         body: "Adjust the start time if you're still awake and scrolling after it begins — the schedule only helps if it matches your actual bedtime.",
//       },
//     ],
//     expectedOutcome:
//       "Your phone will automatically quiet down and (optionally) switch to grayscale during your chosen sleep window, without you needing to remember to do it manually each night.",
//     commonProblems: [
//       {
//         problem: "Sleep Focus never turns on automatically.",
//         fix: "Confirm a sleep schedule is actually set in the Health app — Sleep Focus activates from that schedule, not from the Focus settings screen alone.",
//       },
//       {
//         problem: "I still get calls or urgent messages during Bedtime Mode.",
//         fix: "Both platforms let you allow specific contacts or repeated callers through — check your Do Not Disturb / Focus exceptions.",
//       },
//     ],
//     officialReferences: [
//       { label: "Apple: Use Focus on iPhone", url: "https://support.apple.com/en-us/HT212608" },
//       { label: "Google: Digital Wellbeing overview", url: "https://support.google.com/android/answer/9346420" },
//     ],
//      image:[
//       {url:"/greenheart.svg"}
//     ],
//   },
//   {
//     slug: "website-distraction-tracker-blocking",
//     title: "Guide 3: Website Distraction and Tracker Blocking",
//     objective:
//       "Install a browser extension to block distracting sites on a schedule and reduce third-party tracking while you browse.",
//     supportedDevices: ["Windows", "macOS", "Linux", "Chrome", "Firefox"],
//     prerequisites: ["Firefox, Chrome, or Edge installed", "A short list of the sites you actually want to block"],
//     steps: [
//       {
//         title: "Choose your browser carefully if you want the full ad blocker",
//         body: "As of late 2026, the full version of uBlock Origin is only installable on Firefox — Chrome and Chromium-based Edge now only offer the reduced-capability 'uBlock Origin Lite'. Firefox is the better choice here if that matters to you.",
//       },
//       {
//         title: "Install LeechBlock NG for scheduled site blocking",
//         body: "Visit proginosko.com/leechblock/ or your browser's extension store, install it, and open its options page.",
//       },
//       {
//         title: "Add a block set",
//         body: "Create a named set (e.g. 'Study Hours'), add the domains you want blocked (e.g. social media sites), and set the days/times it should be active.",
//       },
//       {
//         title: "Install uBlock Origin or Privacy Badger for tracking protection",
//         body: "Add either (or both — they're complementary) from your browser's extension store, following the platform note in step 1.",
//       },
//       {
//         title: "Test the setup",
//         body: "Visit a blocked site during an active block window to confirm it's actually blocked, and check the extension icon shows trackers being blocked on a few everyday sites.",
//       },
//     ],
//     expectedOutcome:
//       "Distracting sites will be inaccessible in your browser during study hours, and third-party trackers will be reduced on the sites you do visit.",
//     commonProblems: [
//       {
//         problem: "uBlock Origin isn't available in the Chrome Web Store.",
//         fix: "This is expected as of August 31, 2026 — Google removed the full version. Use uBlock Origin Lite on Chrome, or switch to Firefox for the full version.",
//       },
//       {
//         problem: "LeechBlock isn't blocking a site I added.",
//         fix: "Double-check the domain format (no 'https://' prefix needed) and confirm the current time falls inside the block set's active schedule.",
//       },
//     ],
//     officialReferences: [
//       { label: "LeechBlock NG documentation", url: "https://www.proginosko.com/leechblock/documentation/" },
//       { label: "uBlock Origin wiki", url: "https://github.com/gorhill/uBlock/wiki" },
//       { label: "Privacy Badger", url: "https://privacybadger.org/" },
//     ],
//      image:[
//       {url:"/greenheart.svg"}
//     ],
//   },
// ];

// export function getGuideBySlug(slug: string): Guide | undefined {
//   return GUIDES.find((g) => g.slug === slug);
// }
