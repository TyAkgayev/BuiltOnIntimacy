import { useEffect, useRef, useState, createElement } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=Great+Vibes&display=swap';
  document.head.appendChild(link);
}

const C = {
  bg: '#0a0a0a',
  maroon: '#260810',
  copper: '#c98868',
  blush: '#f5d5c8',
  white: '#ffffff',
  divider: '#5a2028',
  muted: '#cdb8b0',
};

const CONTACT_EMAIL = 'hello@builtonintimacy.com';

const NAV_LINKS = ['About', 'Coaching', 'Programs', 'Resources'];

const FEATURES = [
  {
    icon: 'heart-outline',
    title: 'Reconnect',
    desc: 'Reignite emotional closeness and understanding.',
    detail:
      'Rediscover the deep emotional bond that first brought you together. Through guided exercises and meaningful conversations, we help couples rebuild trust, restore warmth, and rekindle the friendship at the heart of your relationship — so you feel like partners again, not just housemates.',
  },
  {
    icon: 'chatbubble-ellipses-outline',
    title: 'Communicate',
    desc: 'Learn tools for honest, respectful, and open conversations.',
    detail:
      'Master the art of truly listening and being heard. We teach proven communication frameworks that help couples navigate difficult topics with empathy, reduce defensiveness, and turn conflict into connection — creating conversations that bring you closer instead of pushing you apart.',
  },
  {
    icon: 'flame-outline',
    title: 'Intimacy',
    desc: 'Deepen emotional and physical intimacy.',
    detail:
      'Intimacy is more than physical — it\'s about feeling truly seen, desired, and cherished. We guide couples in exploring both emotional and physical closeness, helping you create a safe space for vulnerability and desire so that your connection deepens naturally and sustainably.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Stronger Together',
    desc: 'Build a relationship that can weather any season.',
    detail:
      'Build the foundation for a partnership that grows stronger through every challenge. We equip couples with conflict resolution tools, shared values alignment, and a resilient mindset — so your relationship becomes your greatest source of strength no matter what life brings.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'We were on the verge of separation when we started coaching. Six months later, we have the relationship we always dreamed of. The tools we learned changed everything.',
    name: 'Marcus & Leila',
    detail: 'Married 8 years',
  },
  {
    quote:
      'I never knew how much unspoken resentment was holding us back. The communication work we did unlocked a level of understanding I didn\'t think was possible.',
    name: 'Jordan & Priya',
    detail: 'Together 5 years',
  },
  {
    quote:
      'The intimacy coaching was transformative. We went from feeling like roommates to truly feeling like partners again. I\'m so grateful we made this investment.',
    name: 'David & Sofia',
    detail: 'Married 12 years',
  },
];

const SOCIALS = [
  { label: 'Instagram', url: 'https://www.instagram.com/mrsjobe_therelationshipbuilder/', avatar: require('./assets/insta.png') },
  { label: 'Snapchat',  url: 'https://snapchat.com/t/UlOVLDhF',                          avatar: require('./assets/snap.png') },
  { label: 'TikTok',    url: 'https://tiktok.com/@mrsjobe24_7relations',                  avatar: require('./assets/tiktok.png') },
  { label: 'YouTube',   url: 'https://www.youtube.com/@Mrsjobe',                          avatar: require('./assets/youtube.png') },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Book a Session', desc: 'Choose a time that fits your schedule — mornings, evenings, or weekends. No waiting rooms, no commute.' },
  { step: '02', title: 'Complete Your Assessment', desc: 'Share your relationship goals and challenges so your coach can tailor every session specifically to you.' },
  { step: '03', title: 'Start Your Journey', desc: 'Meet with Fateemah and begin building the skills, tools, and intimacy that transform your partnership.' },
];

const BENEFITS = [
  { icon: 'person-outline',       title: '1-on-1 Personalized Coaching', desc: 'Every session is tailored to your unique relationship dynamic — no generic advice, ever.' },
  { icon: 'bulb-outline',         title: 'Proven Frameworks',            desc: 'Evidence-based tools that create lasting change, not just temporary fixes.' },
  { icon: 'calendar-outline',     title: 'Flexible Scheduling',          desc: 'Available mornings, evenings, and weekends — sessions designed to fit your life.' },
  { icon: 'lock-closed-outline',  title: 'Private & Confidential',       desc: 'Everything shared stays between you and your coach. A safe space, always.' },
  { icon: 'trending-up-outline',  title: 'Measurable Progress',          desc: 'Clear milestones so you can see and feel the growth happening in real time.' },
  { icon: 'infinite-outline',     title: 'Ongoing Support',              desc: 'Resources and check-ins between sessions to keep your momentum going.' },
];

export default function App() {
  const isWeb = Platform.OS === 'web';
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 820 && height > 500;
  const isMobileLandscape = !isDesktop && width > height;

  const COUPLE_RATIO = 1536 / 1024;
  const coupleW = Math.min(680, Math.max(420, height * 0.72));
  const coupleH = Math.round(coupleW / COUPLE_RATIO);

  const scrollY = useRef(new Animated.Value(0)).current;
  const featureScales = useRef(FEATURES.map(() => new Animated.Value(1))).current;
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const videoProgress = useRef(new Animated.Value(0)).current;
  const btnFlip = useRef(new Animated.Value(1)).current;

  const [menuOpen, setMenuOpen]       = useState(false);
  const [formOpen, setFormOpen]       = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [name, setName]               = useState('');
  const [contact, setContact]         = useState('');
  const [message, setMessage]         = useState('');
  const [activeFeature, setActiveFeature] = useState(null);
  const [videoPlaying, setVideoPlaying]   = useState(false);
  const [videoMuted, setVideoMuted]             = useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration]       = useState(0);
  const [btnIndex, setBtnIndex]           = useState(0);
  const [activePage, setActivePage]       = useState(null);
  const [authOpen, setAuthOpen]           = useState(false);
  const [authTab, setAuthTab]             = useState('login');
  const [authName, setAuthName]           = useState('');
  const [authEmail, setAuthEmail]         = useState('');
  const [authPass, setAuthPass]           = useState('');
  const [activeBenefitIdx, setActiveBenefitIdx] = useState(0);

  const benefitPeek = 44;
  const benefitGap = 16;
  const benefitCardW = width - 2 * benefitPeek;
  const benefitSnapInterval = benefitCardW + benefitGap;
  const benefitPadding = (width - benefitCardW) / 2;

  const onBenefitScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / benefitSnapInterval);
    setActiveBenefitIdx(Math.max(0, Math.min(idx, BENEFITS.length - 1)));
  };

  const videoW = isDesktop ? Math.min(width - 120, 960) : width - 56;
  const videoH = Math.round(videoW * 9 / 16);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    // Inject apple-touch-icon using a temporary img to resolve the Metro asset URL
    try {
      const img = document.createElement('img');
      img.onload = () => {
        const el = document.createElement('link');
        el.rel = 'apple-touch-icon';
        el.href = img.src;
        document.head.appendChild(el);
      };
      // Metro serves assets at this path in both dev and prod
      const assetId = require('./assets/Intricate_I.png');
      const src = typeof assetId === 'string' ? assetId : null;
      if (src) img.src = src;
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const timer = setTimeout(() => {
      const node = videoContainerRef.current;
      if (!node) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            hlsRef.current?.startLoad();
            videoRef.current?.play();
            setVideoPlaying(true);
            Animated.timing(videoProgress, { toValue: 1, duration: 500, useNativeDriver: false }).start();
            observer.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      observer.observe(node);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const HLS_SRC = 'https://customer-hn6ktj1ftkgu18l4.cloudflarestream.com/59106224cea112dfe4fceca8eef3b3d6/manifest/video.m3u8';

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    let destroyed = false;
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari — native HLS
      video.src = HLS_SRC;
    } else {
      import('hls.js').then(({ default: Hls }) => {
        if (destroyed || !Hls.isSupported()) return;
        const hls = new Hls({ autoStartLoad: false });
        hls.loadSource(HLS_SRC);
        hls.attachMedia(video);
        hlsRef.current = hls;
      });
    }

    return () => {
      destroyed = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, []);

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    if (Platform.OS !== 'web' || !videoRef.current) return;
    if (videoPlaying) {
      videoRef.current.pause();
      setVideoPlaying(false);
      videoProgress.setValue(0);
    } else {
      hlsRef.current?.startLoad();
      videoRef.current.play();
      setVideoPlaying(true);
      Animated.timing(videoProgress, { toValue: 1, duration: 500, useNativeDriver: false }).start();
    }
  };

  const BTN_LABELS = ['Schedule Sessions 24/7', 'Download Our App'];

  useEffect(() => {
    const interval = setInterval(() => {
      // Collapse
      Animated.timing(btnFlip, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
        setBtnIndex(i => (i + 1) % BTN_LABELS.length);
        // Expand
        Animated.timing(btnFlip, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const openForm = () => {
    setSubmitted(false);
    setName('');
    setContact('');
    setMessage('');
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (!name.trim() || !contact.trim()) return;
    const subject = encodeURIComponent('New Inquiry — BuiltOnIntimacy');
    const body = encodeURIComponent(
      `Name: ${name}\nContact: ${contact}${message ? `\n\nMessage:\n${message}` : ''}`
    );
    Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`);
    setSubmitted(true);
  };

  const pressFeature = (index) => {
    Animated.sequence([
      Animated.timing(featureScales[index], { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.spring(featureScales[index], { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }),
    ]).start();
    setActiveFeature(FEATURES[index]);
  };

  const bgTranslate = scrollY.interpolate({
    inputRange: [0, 700],
    outputRange: [0, 154],
    extrapolate: 'clamp',
  });
  const coupleTranslate = scrollY.interpolate({
    inputRange: [0, 700],
    outputRange: [0, 70],
    extrapolate: 'clamp',
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const serifWeb = isWeb ? { fontFamily: '"Playfair Display", Georgia, serif' } : {};
  const scriptWeb = isWeb ? { fontFamily: '"Great Vibes", cursive' } : {};
  const geoWeb = isWeb ? { fontFamily: 'Georgia, serif' } : {};

  return (
    <>
      <View style={styles.rootWrap}>
        <StatusBar style="light" />

        {/* ── NAV (sticky) ── */}
        <View style={[styles.nav, isDesktop && styles.navDesktop]}>
          <Text style={[styles.logo, isWeb && styles.logoWeb]}>BuiltOnIntimacy</Text>
          {isDesktop ? (
            <View style={[styles.navLinks, { gap: width >= 1200 ? 36 : 18 }]}>
              {NAV_LINKS.map((item) => (
                <TouchableOpacity key={item} activeOpacity={0.7} onPress={() => setActivePage(item)}>
                  <Text style={[styles.navLinkText, width < 1100 && styles.navLinkTextSm]}>{item}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.navGetStartedBtn} activeOpacity={0.85} onPress={openForm}>
                <Text style={styles.navGetStartedText}>Get Started</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85} onPress={openForm}>
                <Text style={styles.bookBtnText}>Book a Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileBtn} activeOpacity={0.7} onPress={() => setAuthOpen(true)}>
                <Ionicons name="person-circle-outline" size={34} color={C.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.navRight}>
              <TouchableOpacity style={styles.navGetStartedBtn} activeOpacity={0.85} onPress={openForm}>
                <Text style={styles.navGetStartedText}>Get Started</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileBtn} activeOpacity={0.7} onPress={() => setAuthOpen(true)}>
                <Ionicons name="person-circle-outline" size={32} color={C.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.hamburger} activeOpacity={0.7} onPress={() => setMenuOpen(true)}>
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Animated.ScrollView
          style={styles.root}
          contentContainerStyle={styles.rootContent}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >

        {/* ── HERO ── */}
        <View style={[styles.hero, isDesktop ? styles.heroDesktop : isMobileLandscape ? styles.heroLandscape : styles.heroMobile]}>
          <Animated.Image
            source={require('./assets/couple_back.png')}
            style={[
              styles.heroBg,
              isDesktop ? styles.heroBgDesktop : styles.heroBgMobile,
              { transform: [{ translateY: bgTranslate }] },
            ]}
            resizeMode="cover"
          />

          {isDesktop ? (
            <View style={styles.heroRowDesktop}>
              <View style={[styles.heroOverlay, styles.heroOverlayDesktop]}>
                <Text style={[styles.heroHeading, styles.heroHeadingDesktop, serifWeb]}>
                  Better Connection.{'\n'}Better Love.
                </Text>
                <Text style={[styles.heroScript, styles.heroScriptDesktop, scriptWeb]}>
                  Built on Intimacy.
                </Text>
                <Text style={styles.heroBody}>
                  I help couples create deeper intimacy, heal,{'\n'}and build a
                  relationship that feels safe,{'\n'}passionate, and unshakable.
                </Text>
                <Animated.View style={{ transform: [{ scaleY: btnFlip }] }}>
                  <TouchableOpacity style={styles.connectBtn} activeOpacity={0.85} onPress={openForm}>
                    <Text style={styles.connectBtnText}>{BTN_LABELS[btnIndex]}</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
              <View style={styles.heroRightDesktop}>
                <Animated.Image
                  source={require('./assets/couple.png')}
                  style={[{ width: coupleW, height: coupleH }, { transform: [{ translateY: coupleTranslate }] }]}
                  resizeMode="contain"
                />
              </View>
            </View>
          ) : isMobileLandscape ? (
            /* ── Landscape phone: text left, couple right ── */
            <View style={[styles.heroColMobile, styles.heroLandscapeRow]}>
              <View style={styles.heroTextLandscape}>
                <Text style={[styles.heroHeading, styles.heroHeadingLandscape, serifWeb]}>
                  Better Connection.{'\n'}Better Love.
                </Text>
                <Text style={[styles.heroScript, styles.heroScriptLandscape, scriptWeb]}>
                  Built on Intimacy.
                </Text>
                <Animated.View style={{ transform: [{ scaleY: btnFlip }] }}>
                  <TouchableOpacity style={styles.connectBtn} activeOpacity={0.85} onPress={openForm}>
                    <Text style={styles.connectBtnText}>{BTN_LABELS[btnIndex]}</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
              <View style={styles.heroCoupleWrapLandscape}>
                <Animated.Image
                  source={require('./assets/couple.png')}
                  style={[styles.coupleImgLandscape, { transform: [{ translateY: coupleTranslate }] }]}
                  resizeMode="cover"
                />
                <View style={styles.heroCoupleGradientLeft} />
              </View>
            </View>
          ) : (
            /* ── Portrait phone: couple on top, text below ── */
            <View style={styles.heroColMobile}>
              <View style={styles.heroCoupleWrapMobile}>
                <Animated.Image
                  source={require('./assets/couple.png')}
                  style={[styles.coupleImgMobile, { transform: [{ translateY: coupleTranslate }] }]}
                  resizeMode="cover"
                />
                {/* gradient fades the bottom of the couple into the content below */}
                <View style={styles.heroCoupleGradient} />
              </View>
              <View style={styles.heroTextMobile}>
                <Text style={[styles.heroHeading, serifWeb]}>
                  Better Connection.{'\n'}Better Love.
                </Text>
                <Text style={[styles.heroScript, scriptWeb]}>Built on Intimacy.</Text>
                <Text style={styles.heroBodyMobile}>
                  I help couples create deeper intimacy, heal, and build a
                  relationship that feels safe, passionate, and unshakable.
                </Text>
                <Animated.View style={{ transform: [{ scaleY: btnFlip }] }}>
                  <TouchableOpacity style={styles.connectBtn} activeOpacity={0.85} onPress={openForm}>
                    <Text style={styles.connectBtnText}>{BTN_LABELS[btnIndex]}</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          )}
        </View>

        {/* ── FEATURES ── */}
        {isDesktop ? (
          <View style={styles.featuresDesktop}>
            {FEATURES.map((f, i) => (
              <View key={f.title} style={styles.featureRowDesktop}>
                <Animated.View style={[styles.featureItemDesktop, { transform: [{ scale: featureScales[i] }] }]}>
                  <TouchableOpacity onPress={() => pressFeature(i)} activeOpacity={1} style={styles.featureTouchable}>
                    <Ionicons name={f.icon} size={38} color={C.copper} />
                    <Text style={[styles.featureTitle, geoWeb]}>{f.title}</Text>
                    <Text style={styles.featureDesc}>{f.desc}</Text>
                    <Text style={styles.featureTapHint}>Learn more →</Text>
                  </TouchableOpacity>
                </Animated.View>
                {i < FEATURES.length - 1 && <View style={styles.featureDivider} />}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.featuresMobile}>
            <View style={styles.featureGridRow}>
              {FEATURES.slice(0, 2).map((f, i) => (
                <Animated.View
                  key={f.title}
                  style={[
                    styles.featureGridCell,
                    i === 0 && styles.featureGridCellBorder,
                    { transform: [{ scale: featureScales[i] }] },
                  ]}
                >
                  <TouchableOpacity onPress={() => pressFeature(i)} activeOpacity={1} style={styles.featureTouchable}>
                    <Ionicons name={f.icon} size={32} color={C.copper} />
                    <Text style={[styles.featureTitle, styles.featureTitleMobile, geoWeb]}>{f.title}</Text>
                    <Text style={styles.featureDesc}>{f.desc}</Text>
                    <Text style={styles.featureTapHintMobile}>Tap →</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
            <View style={styles.featureGridDividerH} />
            <View style={styles.featureGridRow}>
              {FEATURES.slice(2, 4).map((f, i) => (
                <Animated.View
                  key={f.title}
                  style={[
                    styles.featureGridCell,
                    i === 0 && styles.featureGridCellBorder,
                    { transform: [{ scale: featureScales[i + 2] }] },
                  ]}
                >
                  <TouchableOpacity onPress={() => pressFeature(i + 2)} activeOpacity={1} style={styles.featureTouchable}>
                    <Ionicons name={f.icon} size={32} color={C.copper} />
                    <Text style={[styles.featureTitle, styles.featureTitleMobile, geoWeb]}>{f.title}</Text>
                    <Text style={styles.featureDesc}>{f.desc}</Text>
                    <Text style={styles.featureTapHintMobile}>Tap →</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        )}

        {/* ── VIDEO SECTION ── */}
        <View style={[styles.videoSection, isDesktop && styles.videoSectionDesktop]}>
          <Text style={styles.sectionLabel}>Featured</Text>
          <Text style={[styles.videoHeading, serifWeb]}>
            From Desire To Intimacy.{'\n'}How to Keep It Alive
          </Text>
          <Text style={styles.videoAuthor}>
            Fateemah Jobe, Relationship Expert and Sexuality Coach
          </Text>
          <View ref={videoContainerRef} style={[styles.videoPlayer, { width: videoW, height: videoH }]}>
            {/* Real video */}
            {Platform.OS === 'web' && createElement('video', {
              ref: videoRef,
              style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' },
              playsInline: true,
              muted: true,
              preload: 'none',
              onTimeUpdate: (e) => setVideoCurrentTime(e.target.currentTime),
              onLoadedMetadata: (e) => setVideoDuration(e.target.duration),
              onEnded: () => { setVideoPlaying(false); videoProgress.setValue(0); },
            })}
            {/* Play / pause overlay */}
            <TouchableOpacity onPress={toggleVideo} activeOpacity={1} style={styles.videoOverlay}>
              <Animated.View style={{ opacity: videoPlaying ? videoProgress.interpolate({ inputRange: [0, 0.15], outputRange: [1, 0], extrapolate: 'clamp' }) : 1 }}>
                <View style={styles.playBtnCircle}>
                  <Ionicons name={videoPlaying ? 'pause' : 'play'} size={34} color={C.bg} style={{ marginLeft: videoPlaying ? 0 : 3 }} />
                </View>
              </Animated.View>
            </TouchableOpacity>
            {/* Bottom control bar */}
            <View style={styles.videoBar}>
              <TouchableOpacity onPress={toggleVideo}>
                <Ionicons name={videoPlaying ? 'pause' : 'play'} size={18} color={C.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                if (!videoRef.current) return;
                const next = !videoMuted;
                videoRef.current.muted = next;
                setVideoMuted(next);
              }}>
                <Ionicons name={videoMuted ? 'volume-mute' : 'volume-high'} size={18} color={C.white} />
              </TouchableOpacity>
              <View style={styles.videoProgressTrack}>
                <View style={[styles.videoProgressFill, {
                  width: videoDuration > 0 ? `${(videoCurrentTime / videoDuration) * 100}%` : '0%',
                }]} />
              </View>
              <Text style={styles.videoTime}>
                {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── HOW IT WORKS ── */}
        <View style={[styles.howSection, isDesktop && styles.howSectionDesktop]}>
          <Text style={styles.sectionLabel}>Simple Process</Text>
          <Text style={[styles.sectionHeading, serifWeb]}>How It Works</Text>
          <View style={[styles.howSteps, isDesktop && styles.howStepsDesktop]}>
            {HOW_IT_WORKS.map((s, i) => (
              <View key={s.step} style={[styles.howStep, isDesktop && styles.howStepDesktop]}>
                <Text style={[styles.howStepNumber, geoWeb]}>{s.step}</Text>
                <View style={styles.howStepLine} />
                <Text style={[styles.howStepTitle, geoWeb]}>{s.title}</Text>
                <Text style={styles.howStepDesc}>{s.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── BENEFITS ── */}
        <View style={[styles.benefitsSection, isDesktop && styles.benefitsSectionDesktop]}>
          <Text style={styles.sectionLabel}>Why Us</Text>
          <Text style={[styles.sectionHeading, serifWeb]}>Our Benefits</Text>
          {isDesktop ? (
            <View style={styles.benefitsGrid}>
              {BENEFITS.map((b) => (
                <View key={b.title} style={[styles.benefitCard, styles.benefitCardDesktop]}>
                  <View style={styles.benefitIconWrap}>
                    <Ionicons name={b.icon} size={28} color={C.copper} />
                  </View>
                  <Text style={[styles.benefitTitle, geoWeb]}>{b.title}</Text>
                  <Text style={styles.benefitDesc}>{b.desc}</Text>
                </View>
              ))}
            </View>
          ) : (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={benefitSnapInterval}
                snapToAlignment="center"
                decelerationRate="fast"
                contentContainerStyle={[styles.benefitsScroll, { paddingHorizontal: benefitPadding }]}
                style={[styles.benefitsScrollView, isWeb && { scrollSnapType: 'x mandatory' }]}
                onScroll={onBenefitScroll}
                scrollEventThrottle={16}
              >
                {BENEFITS.map((b, i) => (
                  <View
                    key={b.title}
                    style={[
                      styles.benefitCard,
                      { width: benefitCardW, opacity: i === activeBenefitIdx ? 1 : 0.35 },
                      isWeb && { scrollSnapAlign: 'center', transition: 'opacity 0.25s', userSelect: 'none' },
                    ]}
                  >
                    <View style={styles.benefitIconWrap}>
                      <Ionicons name={b.icon} size={28} color={C.copper} />
                    </View>
                    <Text style={[styles.benefitTitle, geoWeb]}>{b.title}</Text>
                    <Text style={styles.benefitDesc}>{b.desc}</Text>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.benefitDots}>
                {BENEFITS.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.benefitDot, i === activeBenefitIdx && styles.benefitDotActive]}
                  />
                ))}
              </View>
            </>
          )}
          <TouchableOpacity style={[styles.connectBtn, { marginTop: 32, alignSelf: 'center' }]} activeOpacity={0.85} onPress={openForm}>
            <Text style={styles.connectBtnText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* ── TESTIMONIALS ── */}
        <View style={[styles.testimonialsSection, isDesktop && styles.testimonialsSectionDesktop]}>
          <Text style={[styles.sectionLabel]}>What Couples Are Saying</Text>
          <Text style={[styles.sectionHeading, serifWeb]}>Real Stories.{'\n'}Real Results.</Text>
          <View style={[styles.testimonialsRow, isDesktop && styles.testimonialsRowDesktop]}>
            {TESTIMONIALS.map((t, i) => (
              <View
                key={t.name}
                style={[
                  styles.testimonialCard,
                  isDesktop && styles.testimonialCardDesktop,
                  i < TESTIMONIALS.length - 1 && isDesktop && { marginRight: 24 },
                ]}
              >
                <Text style={styles.testimonialQuoteMark}>"</Text>
                <Text style={styles.testimonialQuote}>{t.quote}</Text>
                <View style={styles.testimonialDivider} />
                <Text style={[styles.testimonialName, geoWeb]}>{t.name}</Text>
                <Text style={styles.testimonialDetail}>{t.detail}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── CTA CLOSER ── */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaHeart}>
            <Ionicons name="heart" size={isDesktop ? 220 : 160} color="rgba(201,136,104,0.12)" />
          </View>
          <Text style={[styles.ctaHeading, serifWeb]}>
            Don't Settle for Less.
          </Text>
          <Text style={[styles.ctaScript, scriptWeb]}>Make your love life come to life.</Text>
          <Text style={styles.ctaBody}>
            Your relationship deserves the same care and investment as everything else in your life.
            Take the first step today.
          </Text>
          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85} onPress={openForm}>
            <Text style={styles.ctaBtnText}>Start Your Journey</Text>
          </TouchableOpacity>
        </View>

        {/* ── SOCIAL ── */}
        <View style={styles.socialSection}>
          <Text style={[styles.socialHeading, serifWeb]}>Connect With Us</Text>
          <Text style={styles.socialSubtitle}>Follow along for tips, stories, and daily inspiration.</Text>
          <View style={styles.socialRow}>
            {SOCIALS.map((s) => (
              <TouchableOpacity
                key={s.label}
                style={styles.socialBtn}
                activeOpacity={0.75}
                onPress={() => Linking.openURL(s.url)}
              >
                <Image source={s.avatar} style={styles.socialAvatar} />
                <Text style={styles.socialLabel}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.footerCopy}>© 2025 BuiltOnIntimacy.com · All rights reserved</Text>
        </View>
      </Animated.ScrollView>
      </View>

      {/* ── FEATURE DETAIL MODAL ── */}
      <Modal
        visible={!!activeFeature}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setActiveFeature(null)}
      >
        {activeFeature && (
          <View style={styles.featureModal}>
            <TouchableOpacity
              style={styles.featureModalClose}
              onPress={() => setActiveFeature(null)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={28} color={C.white} />
            </TouchableOpacity>
            <View style={styles.featureModalContent}>
              <View style={styles.featureModalIcon}>
                <Ionicons name={activeFeature.icon} size={52} color={C.copper} />
              </View>
              <Text style={[styles.featureModalTitle, serifWeb]}>{activeFeature.title}</Text>
              <View style={styles.featureModalDivider} />
              <Text style={styles.featureModalDetail}>{activeFeature.detail}</Text>
              <TouchableOpacity
                style={[styles.connectBtn, { alignSelf: 'center', marginTop: 40 }]}
                activeOpacity={0.85}
                onPress={() => { setActiveFeature(null); openForm(); }}
              >
                <Text style={styles.connectBtnText}>Book a Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>

      {/* ── MOBILE NAV MENU ── */}
      <Modal
        visible={menuOpen}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={styles.mobileMenu}>
          <View style={styles.mobileMenuHeader}>
            <Text style={[styles.logo, isWeb && styles.logoWeb]}>BuiltOnIntimacy</Text>
            <TouchableOpacity onPress={() => setMenuOpen(false)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="close" size={28} color={C.white} />
            </TouchableOpacity>
          </View>
          {NAV_LINKS.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.mobileMenuLink}
              activeOpacity={0.7}
              onPress={() => { setMenuOpen(false); setActivePage(item); }}
            >
              <Text style={[styles.mobileMenuLinkText, geoWeb]}>{item}</Text>
              <Ionicons name="chevron-forward" size={18} color={C.copper} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.mobileMenuBookBtn}
            activeOpacity={0.85}
            onPress={() => { setMenuOpen(false); openForm(); }}
          >
            <Text style={styles.bookBtnText}>Book a Call</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* ── CONTACT FORM MODAL ── */}
      <Modal
        visible={formOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setFormOpen(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: C.bg }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.formHeader}>
              <Text style={[styles.formTitle, serifWeb]}>Get in Touch</Text>
              <TouchableOpacity onPress={() => setFormOpen(false)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Ionicons name="close" size={28} color={C.white} />
              </TouchableOpacity>
            </View>

            {submitted ? (
              <View style={styles.formSuccess}>
                <Ionicons name="checkmark-circle" size={72} color={C.copper} />
                <Text style={[styles.formSuccessTitle, serifWeb]}>Thank you!</Text>
                <Text style={styles.formSuccessBody}>
                  We'll review your message and be in touch soon.
                </Text>
                <TouchableOpacity style={styles.connectBtn} activeOpacity={0.85} onPress={() => setFormOpen(false)}>
                  <Text style={styles.connectBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.formSubtitle}>
                  Leave your details and we'll reach out to schedule your complimentary discovery call.
                </Text>
                <Text style={styles.formLabel}>Your Name *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Jane Smith"
                  placeholderTextColor={C.muted}
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                />
                <Text style={styles.formLabel}>Phone or Email *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="(555) 555-5555 or jane@email.com"
                  placeholderTextColor={C.muted}
                  value={contact}
                  onChangeText={setContact}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                />
                <Text style={styles.formLabel}>Message (optional)</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  placeholder="Tell us a bit about what you're looking for…"
                  placeholderTextColor={C.muted}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={[
                    styles.connectBtn,
                    styles.formSubmitBtn,
                    (!name.trim() || !contact.trim()) && styles.formSubmitDisabled,
                  ]}
                  activeOpacity={0.85}
                  onPress={handleSubmit}
                >
                  <Text style={styles.connectBtnText}>Send Message</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── AUTH MODAL ── */}
      <Modal visible={authOpen} animationType="slide" transparent={false} onRequestClose={() => setAuthOpen(false)}>
        <KeyboardAvoidingView style={styles.authWrap} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={styles.authScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {authTab === 'login' ? 'Welcome Back' : 'Create Account'}
              </Text>
              <TouchableOpacity onPress={() => setAuthOpen(false)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Ionicons name="close" size={28} color={C.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.formSubtitle}>
              {authTab === 'login'
                ? 'Sign in to manage your sessions and progress.'
                : 'Join BuiltOnIntimacy and start your journey today.'}
            </Text>

            {/* tabs */}
            <View style={styles.authTabs}>
              <TouchableOpacity
                style={[styles.authTab, authTab === 'login' && styles.authTabActive]}
                onPress={() => setAuthTab('login')}
                activeOpacity={0.8}
              >
                <Text style={[styles.authTabText, authTab === 'login' && styles.authTabTextActive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authTab, authTab === 'register' && styles.authTabActive]}
                onPress={() => setAuthTab('register')}
                activeOpacity={0.8}
              >
                <Text style={[styles.authTabText, authTab === 'register' && styles.authTabTextActive]}>Register</Text>
              </TouchableOpacity>
            </View>

            {authTab === 'register' && (
              <>
                <Text style={styles.formLabel}>Full Name *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Jane Smith"
                  placeholderTextColor={C.muted}
                  value={authName}
                  onChangeText={setAuthName}
                  returnKeyType="next"
                />
              </>
            )}

            <Text style={styles.formLabel}>Email Address *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="jane@email.com"
              placeholderTextColor={C.muted}
              value={authEmail}
              onChangeText={setAuthEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />

            <Text style={styles.formLabel}>Password *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="••••••••"
              placeholderTextColor={C.muted}
              value={authPass}
              onChangeText={setAuthPass}
              secureTextEntry
              returnKeyType="done"
            />

            <TouchableOpacity
              style={[styles.connectBtn, { alignSelf: 'stretch', alignItems: 'center', marginTop: 8 }]}
              activeOpacity={0.85}
              onPress={() => setAuthOpen(false)}
            >
              <Text style={styles.connectBtnText}>
                {authTab === 'login' ? 'Sign In' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 20, alignItems: 'center' }}
              activeOpacity={0.7}
              onPress={() => setAuthTab(authTab === 'login' ? 'register' : 'login')}
            >
              <Text style={{ color: C.copper, fontSize: 14 }}>
                {authTab === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign In'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── PAGE MODALS ── */}
      <Modal visible={activePage !== null} animationType="slide" transparent={false} onRequestClose={() => setActivePage(null)}>
        <View style={styles.pageMod}>
          <View style={styles.pageModHeader}>
            <TouchableOpacity onPress={() => setActivePage(null)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="arrow-back" size={26} color={C.white} />
            </TouchableOpacity>
            <Text style={[styles.pageModTitle, geoWeb]}>{activePage}</Text>
            <View style={{ width: 26 }} />
          </View>

          <ScrollView contentContainerStyle={styles.pageModScroll} showsVerticalScrollIndicator={false}>

            {/* ── ABOUT ── */}
            {activePage === 'About' && <>
              <View style={styles.pageModHero}>
                <Image source={require('./assets/couple.png')} style={styles.pageModHeroImg} />
                <View style={styles.pageModHeroOverlay} />
                <View style={styles.pageModHeroText}>
                  <Text style={[styles.pageModH1, serifWeb]}>Meet Fateemah Jobe</Text>
                  <Text style={styles.pageModSubtitle}>Relationship Expert & Sexuality Coach</Text>
                </View>
              </View>
              <View style={styles.pageModBody}>
                <Text style={styles.pageModPara}>
                  Fateemah Jobe is a certified Relationship Expert and Sexuality Coach dedicated to helping couples move beyond surface-level fixes and into the deeper work — rebuilding trust, reigniting desire, and creating a partnership that truly thrives.
                </Text>
                <Text style={styles.pageModPara}>
                  After years of watching couples struggle in silence, she founded BuiltOnIntimacy with one mission: to give every relationship the tools, language, and safe space it needs to flourish. Her approach blends evidence-based communication frameworks with real, compassionate guidance — tailored to your unique dynamic.
                </Text>
                <Text style={[styles.pageModSectionLabel, geoWeb]}>Credentials</Text>
                {[
                  'Certified Relationship Coach',
                  'Sexuality & Intimacy Specialist',
                  'Communication & Conflict Resolution Expert',
                  'Trauma-Informed Coaching Practice',
                ].map(c => (
                  <View key={c} style={styles.pageModBullet}>
                    <Ionicons name="checkmark-circle" size={18} color={C.copper} />
                    <Text style={styles.pageModBulletText}>{c}</Text>
                  </View>
                ))}
                <Text style={[styles.pageModSectionLabel, geoWeb]}>Our Mission</Text>
                <Text style={styles.pageModPara}>
                  To help couples build relationships rooted in deep trust, honest communication, and unapologetic intimacy — because every love story deserves to be great.
                </Text>
                <TouchableOpacity style={[styles.connectBtn, { alignSelf: 'center', marginTop: 8 }]} activeOpacity={0.85} onPress={() => { setActivePage(null); openForm(); }}>
                  <Text style={styles.connectBtnText}>Book a Discovery Call</Text>
                </TouchableOpacity>
              </View>
            </>}

            {/* ── COACHING ── */}
            {activePage === 'Coaching' && <>
              <View style={styles.pageModBody}>
                <Text style={[styles.pageModH1, serifWeb]}>1-on-1 Coaching</Text>
                <Text style={styles.pageModPara}>
                  Every coaching engagement is built entirely around you. No scripts. No generic advice. Just focused, personalized guidance designed to move your relationship forward.
                </Text>
                <Text style={[styles.pageModSectionLabel, geoWeb]}>What a Session Looks Like</Text>
                <Text style={styles.pageModPara}>
                  Sessions are 50–60 minutes, conducted via secure video call from the privacy of your own home. We open with a check-in, work through your focus area for the week, and close with clear action steps you can implement immediately.
                </Text>
                {[
                  { icon: 'shield-checkmark-outline', title: 'Safe & Confidential', desc: 'Everything shared in session stays in session. Always.' },
                  { icon: 'calendar-outline',         title: 'Flexible Scheduling', desc: 'Morning, evening, or weekend — sessions fit your life, not the other way around.' },
                  { icon: 'layers-outline',           title: 'Proven Frameworks',   desc: 'Evidence-based tools that create real, lasting change.' },
                  { icon: 'trending-up-outline',      title: 'Measurable Growth',   desc: 'Clear milestones so you can see and feel the progress happening.' },
                ].map(f => (
                  <View key={f.title} style={styles.pageModFeature}>
                    <View style={styles.benefitIconWrap}>
                      <Ionicons name={f.icon} size={24} color={C.copper} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pageModFeatureTitle}>{f.title}</Text>
                      <Text style={styles.pageModFeatureDesc}>{f.desc}</Text>
                    </View>
                  </View>
                ))}
                <Text style={[styles.pageModSectionLabel, geoWeb]}>Is Coaching Right for You?</Text>
                {[
                  'You feel emotionally disconnected from your partner',
                  'Communication has broken down or turned into conflict',
                  'Intimacy and desire have faded',
                  'You want to rebuild trust after betrayal',
                  "You're ready to stop surviving and start thriving",
                ].map(item => (
                  <View key={item} style={styles.pageModBullet}>
                    <Ionicons name="checkmark-circle" size={18} color={C.copper} />
                    <Text style={styles.pageModBulletText}>{item}</Text>
                  </View>
                ))}
                <TouchableOpacity style={[styles.connectBtn, { alignSelf: 'center', marginTop: 24 }]} activeOpacity={0.85} onPress={() => { setActivePage(null); openForm(); }}>
                  <Text style={styles.connectBtnText}>Schedule a Free Discovery Call</Text>
                </TouchableOpacity>
              </View>
            </>}

            {/* ── PROGRAMS ── */}
            {activePage === 'Programs' && <>
              <View style={styles.pageModBody}>
                <Text style={[styles.pageModH1, serifWeb]}>Our Programs</Text>
                <Text style={styles.pageModPara}>
                  Whether you're looking for intensive one-on-one support or a structured group experience, there's a program designed to meet you where you are.
                </Text>
                {[
                  {
                    icon: 'people-outline',
                    title: 'Couples Intensive',
                    tag: '8 Weeks',
                    desc: 'A deep-dive coaching program for couples ready to do the real work. Covers communication, intimacy, conflict resolution, and rebuilding connection — with weekly sessions and between-session support.',
                  },
                  {
                    icon: 'person-outline',
                    title: '1-on-1 Private Coaching',
                    tag: 'Ongoing',
                    desc: 'Personalized sessions tailored to your relationship goals. Ideal if you want flexible, ongoing support on your own timeline.',
                  },
                  {
                    icon: 'flame-outline',
                    title: 'Reignite Weekend Workshop',
                    tag: 'Intensive',
                    desc: 'A focused weekend experience for couples who want to accelerate transformation. Combines coaching, guided exercises, and breakthrough conversations in an immersive format.',
                  },
                  {
                    icon: 'laptop-outline',
                    title: 'Foundations of Intimacy',
                    tag: 'Self-Paced',
                    desc: 'A digital course covering the core pillars of intimacy and connection. Work through modules on your own schedule and bring the insights into your relationship.',
                  },
                ].map(p => (
                  <View key={p.title} style={styles.pageModCard}>
                    <View style={styles.pageModCardTop}>
                      <View style={styles.benefitIconWrap}>
                        <Ionicons name={p.icon} size={24} color={C.copper} />
                      </View>
                      <View style={styles.pageModCardTag}>
                        <Text style={styles.pageModCardTagText}>{p.tag}</Text>
                      </View>
                    </View>
                    <Text style={[styles.pageModFeatureTitle, { fontSize: 17, marginBottom: 6 }]}>{p.title}</Text>
                    <Text style={styles.pageModFeatureDesc}>{p.desc}</Text>
                  </View>
                ))}
                <TouchableOpacity style={[styles.connectBtn, { alignSelf: 'center', marginTop: 8 }]} activeOpacity={0.85} onPress={() => { setActivePage(null); openForm(); }}>
                  <Text style={styles.connectBtnText}>Find the Right Program</Text>
                </TouchableOpacity>
              </View>
            </>}

            {/* ── RESOURCES ── */}
            {activePage === 'Resources' && <>
              <View style={styles.pageModBody}>
                <Text style={[styles.pageModH1, serifWeb]}>Resources</Text>
                <Text style={styles.pageModPara}>
                  Free tools, insights, and guides to support your relationship between sessions — and beyond.
                </Text>
                <Text style={[styles.pageModSectionLabel, geoWeb]}>Free Guide</Text>
                <View style={styles.pageModCard}>
                  <Ionicons name="document-text-outline" size={32} color={C.copper} style={{ marginBottom: 12 }} />
                  <Text style={[styles.pageModFeatureTitle, { fontSize: 17 }]}>5 Conversations Every Couple Must Have</Text>
                  <Text style={[styles.pageModFeatureDesc, { marginTop: 6, marginBottom: 16 }]}>
                    A practical guide covering the five most important — and often avoided — conversations that determine the health of your relationship.
                  </Text>
                  <TouchableOpacity style={styles.pageModOutlineBtn} activeOpacity={0.8} onPress={() => { setActivePage(null); openForm(); }}>
                    <Text style={styles.pageModOutlineBtnText}>Get the Free Guide</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.pageModSectionLabel, geoWeb]}>Tips & Insights</Text>
                {[
                  { icon: 'chatbubbles-outline',  title: 'How to Fight Fair',              desc: 'Turn conflict into closeness with these communication ground rules.' },
                  { icon: 'heart-outline',         title: 'Rebuilding Desire After Kids',  desc: 'Practical ways to reconnect as partners, not just co-parents.' },
                  { icon: 'lock-open-outline',     title: 'The Art of Emotional Safety',   desc: 'Why your partner shuts down — and what to do instead of pushing.' },
                  { icon: 'infinite-outline',      title: 'Breaking the Pursue-Withdraw Cycle', desc: 'Understand the dynamic keeping you both stuck and how to shift it.' },
                ].map(r => (
                  <View key={r.title} style={styles.pageModFeature}>
                    <View style={styles.benefitIconWrap}>
                      <Ionicons name={r.icon} size={22} color={C.copper} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pageModFeatureTitle}>{r.title}</Text>
                      <Text style={styles.pageModFeatureDesc}>{r.desc}</Text>
                    </View>
                  </View>
                ))}
                <Text style={[styles.pageModSectionLabel, geoWeb]}>Follow Along</Text>
                <Text style={styles.pageModPara}>Get daily tips, stories, and inspiration on our social channels.</Text>
                <View style={styles.socialRow}>
                  {SOCIALS.map((s) => (
                    <TouchableOpacity key={s.label} style={styles.socialBtn} activeOpacity={0.75} onPress={() => Linking.openURL(s.url)}>
                      <Image source={s.avatar} style={styles.socialAvatar} />
                      <Text style={styles.socialLabel}>{s.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>}

          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  /* ── PAGE MODALS ── */
  pageMod: { flex: 1, backgroundColor: C.bg },
  pageModHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  pageModTitle: { color: C.white, fontSize: 17, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  pageModScroll: { flexGrow: 1 },
  pageModHero: { width: '100%', height: 260, justifyContent: 'flex-end' },
  pageModHeroImg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', resizeMode: 'cover' },
  pageModHeroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,10,10,0.55)' },
  pageModHeroText: { padding: 24 },
  pageModH1: { color: C.white, fontSize: 30, fontWeight: '700', marginBottom: 20 },
  pageModSubtitle: { color: C.copper, fontSize: 14, fontWeight: '500' },
  pageModBody: { padding: 24, gap: 0 },
  pageModPara: { color: C.muted, fontSize: 15, lineHeight: 24, marginBottom: 20 },
  pageModSectionLabel: {
    color: C.copper, fontSize: 11, fontWeight: '700', letterSpacing: 1.4,
    textTransform: 'uppercase', marginTop: 8, marginBottom: 14,
  },
  pageModBullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  pageModBulletText: { color: C.muted, fontSize: 14, lineHeight: 22, flex: 1 },
  pageModFeature: { flexDirection: 'row', gap: 14, marginBottom: 20, alignItems: 'flex-start' },
  pageModFeatureTitle: { color: C.white, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  pageModFeatureDesc: { color: C.muted, fontSize: 13, lineHeight: 20 },
  pageModCard: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14, padding: 20, marginBottom: 16,
  },
  pageModCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  pageModCardTag: { backgroundColor: 'rgba(201,136,104,0.15)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  pageModCardTagText: { color: C.copper, fontSize: 12, fontWeight: '600' },
  pageModOutlineBtn: {
    borderWidth: 1, borderColor: C.copper, borderRadius: 24,
    paddingVertical: 12, paddingHorizontal: 24, alignSelf: 'flex-start',
  },
  pageModOutlineBtnText: { color: C.copper, fontSize: 14, fontWeight: '600' },

  rootWrap: { flex: 1, backgroundColor: C.bg },
  root: { flex: 1, backgroundColor: C.bg },
  rootContent: { flexGrow: 1 },

  /* ── NAV ── */
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: C.bg,
  },
  navDesktop: { paddingHorizontal: 60, paddingVertical: 22 },
  logo: { color: C.white, fontSize: 17, fontWeight: '600', letterSpacing: 0.3 },
  logoWeb: { fontFamily: 'Georgia, serif', fontSize: 20 },
  navLinks: { flexDirection: 'row', alignItems: 'center', gap: 36 },
  navLinkText: { color: C.white, fontSize: 15, opacity: 0.9 },
  navLinkTextSm: { fontSize: 13 },
  bookBtn: {
    backgroundColor: C.blush,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 50,
  },
  bookBtnText: { color: '#1a0606', fontSize: 15, fontWeight: '600' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileBtn: { padding: 2 },
  navGetStartedBtn: {
    borderWidth: 1,
    borderColor: C.copper,
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  navGetStartedText: { color: C.copper, fontSize: 13, fontWeight: '600' },
  hamburger: { padding: 4, gap: 5 },
  hamburgerLine: { width: 24, height: 2, backgroundColor: C.white, borderRadius: 2, marginVertical: 2 },

  /* ── HERO ── */
  hero: { overflow: 'hidden', backgroundColor: C.bg },
  heroDesktop: { minHeight: 600 },
  heroMobile: { minHeight: 620 },
  heroLandscape: { flex: 1 },
  heroBg: { position: 'absolute', top: 0, left: 0, right: 0, width: '100%' },
  heroBgDesktop: { height: 760 },
  heroBgMobile: { height: 760 },
  heroColMobile: { flex: 1, minHeight: 620 },
  heroLandscapeRow: { flexDirection: 'row', minHeight: 0, flex: 1 },
  heroCoupleWrapMobile: { height: 500, overflow: 'hidden' },
  coupleImgMobile: { width: '100%', height: 500 },
  heroCoupleWrapLandscape: { flex: 1, overflow: 'hidden' },
  coupleImgLandscape: { width: '100%', height: '100%' },
  heroCoupleGradient: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: 240,
    backgroundImage: 'linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.8) 55%, rgba(10,10,10,1) 82%)',
  },
  heroCoupleGradientLeft: {
    position: 'absolute', top: 0, left: 0, bottom: 0, width: 80,
    backgroundImage: 'linear-gradient(to right, rgba(10,10,10,0.9) 0%, transparent 100%)',
  },
  heroTextLandscape: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 16,
    zIndex: 2,
  },
  heroHeadingLandscape: { fontSize: 24, lineHeight: 30, marginBottom: 6 },
  heroScriptLandscape: { fontSize: 22, lineHeight: 28, marginBottom: 14 },
  heroTextMobile: {
    paddingHorizontal: 28,
    paddingTop: 4,
    paddingBottom: 52,
    marginTop: -160,
  },
  heroRowDesktop: { flexDirection: 'row', alignItems: 'flex-end', minHeight: 600 },
  heroOverlay: { paddingHorizontal: 28, paddingVertical: 60, justifyContent: 'center' },
  heroOverlayDesktop: {
    flex: 1,
    maxWidth: 580,
    backgroundColor: 'transparent',
    backgroundImage:
      'linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.6) 45%, transparent 75%)',
    paddingHorizontal: 80,
    paddingVertical: 90,
  },
  heroRightDesktop: {
    flex: 1,
    height: 600,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroBodyMobile: { color: C.muted, fontSize: 15, lineHeight: 24, marginBottom: 32 },
  heroHeading: { color: C.white, fontSize: 34, fontWeight: '700', lineHeight: 44, marginBottom: 10 },
  heroHeadingDesktop: { fontSize: 54, lineHeight: 64, marginBottom: 12 },
  heroScript: { color: C.copper, fontSize: 36, fontStyle: 'italic', marginBottom: 22, lineHeight: 46 },
  heroScriptDesktop: { fontSize: 52, lineHeight: 60, marginBottom: 28 },
  heroBody: { color: C.muted, fontSize: 16, lineHeight: 28, marginBottom: 40 },
  connectBtn: {
    backgroundColor: C.blush,
    alignSelf: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 50,
  },
  connectBtnText: { color: '#1a0606', fontSize: 16, fontWeight: '600' },

  /* ── FEATURES ── */
  featuresDesktop: {
    flexDirection: 'row',
    backgroundColor: C.maroon,
    paddingVertical: 64,
    paddingHorizontal: 60,
    alignItems: 'stretch',
  },
  featureRowDesktop: { flex: 1, flexDirection: 'row' },
  featureItemDesktop: { flex: 1, alignItems: 'center', paddingHorizontal: 32 },
  featureDivider: { width: 1, backgroundColor: C.divider, alignSelf: 'stretch' },
  featuresMobile: { backgroundColor: C.maroon, paddingVertical: 40, paddingHorizontal: 0 },
  featureGridRow: { flexDirection: 'row' },
  featureGridCell: { flex: 1, alignItems: 'center', paddingVertical: 32, paddingHorizontal: 16 },
  featureGridCellBorder: { borderRightWidth: 1, borderRightColor: C.divider },
  featureGridDividerH: { height: 1, backgroundColor: C.divider, marginHorizontal: 24 },
  featureTouchable: { alignItems: 'center' },
  featureTitle: { color: C.white, fontSize: 18, fontWeight: '600', marginTop: 14, marginBottom: 8, textAlign: 'center' },
  featureTitleMobile: { fontSize: 16 },
  featureDesc: { color: '#d4b4a8', fontSize: 13, textAlign: 'center', lineHeight: 20, maxWidth: 160 },
  featureTapHint: { color: C.copper, fontSize: 13, marginTop: 12, opacity: 0.85 },
  featureTapHintMobile: { color: C.copper, fontSize: 12, marginTop: 8, opacity: 0.85 },

  /* ── FEATURE MODAL ── */
  featureModal: { flex: 1, backgroundColor: C.bg, justifyContent: 'center' },
  featureModalClose: { position: 'absolute', top: 52, right: 28, zIndex: 10 },
  featureModalContent: { paddingHorizontal: 36, paddingVertical: 60, alignItems: 'center' },
  featureModalIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: C.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  featureModalTitle: { color: C.white, fontSize: 32, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  featureModalDivider: { width: 48, height: 2, backgroundColor: C.copper, marginBottom: 24 },
  featureModalDetail: { color: C.muted, fontSize: 16, lineHeight: 28, textAlign: 'center', maxWidth: 500 },

  /* ── TESTIMONIALS ── */
  testimonialsSection: {
    backgroundColor: C.bg,
    paddingVertical: 72,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  testimonialsSectionDesktop: { paddingHorizontal: 60 },
  sectionLabel: {
    color: C.copper,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionHeading: {
    color: C.white,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 44,
    textAlign: 'center',
    marginBottom: 48,
  },
  testimonialsRow: { width: '100%' },
  testimonialsRowDesktop: { flexDirection: 'row', justifyContent: 'center' },
  testimonialCard: {
    backgroundColor: '#100505',
    borderWidth: 1,
    borderColor: C.divider,
    borderRadius: 16,
    padding: 32,
    marginBottom: 20,
  },
  testimonialCardDesktop: { flex: 1, maxWidth: 380, marginBottom: 0 },
  testimonialQuoteMark: { color: C.copper, fontSize: 56, lineHeight: 56, marginBottom: 8, fontFamily: 'Georgia, serif' },
  testimonialQuote: { color: C.white, fontSize: 15, lineHeight: 26, marginBottom: 24, fontStyle: 'italic' },
  testimonialDivider: { width: 32, height: 1, backgroundColor: C.divider, marginBottom: 16 },
  testimonialName: { color: C.blush, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  testimonialDetail: { color: C.muted, fontSize: 13 },

  /* ── SOCIAL / FOOTER ── */
  socialSection: {
    backgroundColor: C.maroon,
    paddingVertical: 60,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  socialHeading: { color: C.white, fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  socialSubtitle: { color: C.muted, fontSize: 15, textAlign: 'center', marginBottom: 36 },
  socialRow: { flexDirection: 'row', gap: 20, marginBottom: 48 },
  socialBtn: { alignItems: 'center', gap: 8 },
  socialAvatar: { width: 56, height: 56, borderRadius: 28 },
  socialLabel: { color: C.muted, fontSize: 12 },
  footerCopy: { color: '#6b3030', fontSize: 12, textAlign: 'center' },

  /* ── MOBILE NAV MENU ── */
  mobileMenu: { flex: 1, backgroundColor: C.bg },
  mobileMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  mobileMenuLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 28,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  mobileMenuLinkText: { color: C.white, fontSize: 20, fontWeight: '400', letterSpacing: 0.3 },
  mobileMenuBookBtn: {
    backgroundColor: C.blush,
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 50,
    marginTop: 48,
  },

  /* ── VIDEO SECTION ── */
  videoSection: {
    backgroundColor: '#050505',
    paddingVertical: 72,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.divider,
  },
  videoSectionDesktop: { paddingHorizontal: 60 },
  videoHeading: {
    color: C.white,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 10,
  },
  videoAuthor: {
    color: C.copper,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 36,
    letterSpacing: 0.3,
  },
  videoPlayer: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#0d0d0d',
    borderWidth: 1,
    borderColor: C.divider,
  },
  videoThumbnail: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0d0d0d',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(201,136,104,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    backgroundColor: 'rgba(0,0,0,0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  videoProgressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
  },
  videoProgressFill: {
    height: 3,
    backgroundColor: C.copper,
    borderRadius: 2,
  },
  videoTime: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },

  /* ── BENEFITS ── */
  benefitsSection: {
    backgroundColor: C.maroon,
    paddingVertical: 64,
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  benefitsSectionDesktop: { paddingVertical: 72 },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    paddingHorizontal: 60,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  benefitCardDesktop: { width: 340, opacity: 1 },
  benefitsScrollView: { alignSelf: 'stretch' },
  benefitsScroll: {
    gap: 16,
    paddingBottom: 8,
  },
  benefitCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: C.divider,
    borderRadius: 16,
    padding: 28,
    alignItems: 'flex-start',
  },
  benefitDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  benefitDotActive: {
    width: 24,
    backgroundColor: C.copper,
  },
  benefitIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(201,136,104,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  benefitTitle: {
    color: C.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  benefitDesc: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 20,
  },

  /* ── HOW IT WORKS ── */
  howSection: {
    backgroundColor: C.bg,
    paddingVertical: 72,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.divider,
  },
  howSectionDesktop: { paddingHorizontal: 80 },
  howSteps: { width: '100%', gap: 32, marginTop: 16 },
  howStepsDesktop: { flexDirection: 'row', justifyContent: 'center', gap: 40 },
  howStep: { flex: 1, maxWidth: 340 },
  howStepDesktop: { alignItems: 'flex-start' },
  howStepNumber: { color: C.copper, fontSize: 40, fontWeight: '700', opacity: 0.5, marginBottom: 8 },
  howStepLine: { width: 40, height: 2, backgroundColor: C.copper, opacity: 0.4, marginBottom: 16 },
  howStepTitle: { color: C.white, fontSize: 18, fontWeight: '700', marginBottom: 10 },
  howStepDesc: { color: C.muted, fontSize: 14, lineHeight: 22 },

  /* ── CTA CLOSER ── */
  ctaSection: {
    backgroundColor: C.maroon,
    paddingVertical: 80,
    paddingHorizontal: 28,
    alignItems: 'center',
    overflow: 'hidden',
  },
  ctaHeart: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -110 }, { translateY: -110 }],
  },
  ctaHeading: { color: C.white, fontSize: 36, fontWeight: '700', textAlign: 'center', marginBottom: 12, zIndex: 1 },
  ctaScript: { color: C.copper, fontSize: 28, textAlign: 'center', marginBottom: 20, zIndex: 1 },
  ctaBody: { color: C.muted, fontSize: 15, lineHeight: 24, textAlign: 'center', maxWidth: 460, marginBottom: 40, zIndex: 1 },
  ctaBtn: {
    backgroundColor: C.copper,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    zIndex: 1,
  },
  ctaBtnText: { color: '#1a0606', fontSize: 16, fontWeight: '700' },

  /* ── AUTH MODAL ── */
  authWrap: { flex: 1, backgroundColor: C.bg },
  authScroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 52, paddingBottom: 48 },
  authTabs: {
    flexDirection: 'row',
    backgroundColor: '#150505',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
    gap: 4,
  },
  authTab: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  authTabActive: { backgroundColor: C.maroon },
  authTabText: { color: C.muted, fontSize: 14, fontWeight: '600' },
  authTabTextActive: { color: C.white },

  /* ── CONTACT FORM ── */
  formScroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 24, paddingBottom: 48 },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  formTitle: { color: C.white, fontSize: 26, fontWeight: '700' },
  formSubtitle: { color: C.muted, fontSize: 15, lineHeight: 24, marginBottom: 32 },
  formLabel: { color: C.blush, fontSize: 13, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 },
  formInput: {
    backgroundColor: '#150505',
    borderWidth: 1,
    borderColor: C.divider,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: C.white,
    fontSize: 15,
    marginBottom: 22,
  },
  formTextArea: { height: 120 },
  formSubmitBtn: { alignSelf: 'stretch', alignItems: 'center', marginTop: 8 },
  formSubmitDisabled: { opacity: 0.45 },
  formSuccess: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 20 },
  formSuccessTitle: { color: C.white, fontSize: 32, fontWeight: '700' },
  formSuccessBody: { color: C.muted, fontSize: 16, textAlign: 'center', lineHeight: 26, marginBottom: 12 },
});
