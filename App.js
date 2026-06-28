import { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

const NAV_LINKS = ['About', 'Coaching', 'Programs', 'Resources', 'Blog'];

const FEATURES = [
  { icon: 'heart-outline',              title: 'Reconnect',       desc: 'Reignite emotional closeness and understanding.' },
  { icon: 'chatbubble-ellipses-outline',title: 'Communicate',     desc: 'Learn tools for honest, respectful, and open conversations.' },
  { icon: 'flame-outline',              title: 'Intimacy',        desc: 'Deepen emotional and physical intimacy.' },
  { icon: 'shield-checkmark-outline',   title: 'Stronger Together', desc: 'Build a relationship that can weather any season.' },
];

export default function App() {
  const isWeb = Platform.OS === 'web';
  const { width } = useWindowDimensions();
  const isDesktop = width >= 820;

  // Scale the couple image with the viewport so it never collapses.
  // At 1440px → 580px tall; at 820px → ~380px tall.
  const coupleH = Math.max(320, Math.min(580, (width - 400) * 0.75));
  const coupleW = coupleH * 0.72;

  const scrollY = useRef(new Animated.Value(0)).current;

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

  return (
    <Animated.ScrollView
      style={styles.root}
      contentContainerStyle={styles.rootContent}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      <StatusBar style="light" />

      {/* ── NAV ── */}
      <View style={[styles.nav, isDesktop && styles.navDesktop]}>
        <Text style={[styles.logo, isWeb && styles.logoWeb]}>
          BuiltOnIntimacy.com
        </Text>
        {isDesktop ? (
          <View style={[styles.navLinks, { gap: width >= 1200 ? 36 : 18 }]}>
            {NAV_LINKS.map((item) => (
              <TouchableOpacity key={item} activeOpacity={0.7}>
                <Text style={[styles.navLinkText, width < 1100 && styles.navLinkTextSm]}>{item}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85}>
              <Text style={styles.bookBtnText}>Book a Call</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Mobile: hamburger placeholder */
          <TouchableOpacity style={styles.hamburger} activeOpacity={0.7}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── HERO ── */}
      <View style={[styles.hero, isDesktop ? styles.heroDesktop : styles.heroMobile]}>
        {/* Layer 1 — bokeh background, slowest parallax drift */}
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
          /* ── DESKTOP HERO: text left, couple right ── */
          <View style={styles.heroRowDesktop}>
            <View style={[styles.heroOverlay, styles.heroOverlayDesktop]}>
              <Text style={[styles.heroHeading, styles.heroHeadingDesktop,
                isWeb && { fontFamily: '"Playfair Display", Georgia, serif' }]}>
                Better Connection.{'\n'}Better Love.
              </Text>
              <Text style={[styles.heroScript, styles.heroScriptDesktop,
                isWeb && { fontFamily: '"Great Vibes", cursive' }]}>
                Built on Intimacy.
              </Text>
              <Text style={styles.heroBody}>
                I help couples create deeper intimacy, heal,{'\n'}and build a
                relationship that feels safe,{'\n'}passionate, and unshakable.
              </Text>
              <TouchableOpacity style={styles.connectBtn} activeOpacity={0.85}>
                <Text style={styles.connectBtnText}>Let's Connect</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.heroRightDesktop}>
              <Animated.Image
                source={require('./assets/couple.png')}
                style={[{ width: coupleW, height: coupleH }, { transform: [{ translateY: coupleTranslate }] }]}
                resizeMode="contain"
              />
            </View>
          </View>
        ) : (
          /* ── MOBILE HERO: couple top-right, text bottom ── */
          <View style={styles.heroColMobile}>
            {/* Couple image anchored to right */}
            <View style={styles.heroCoupleWrapMobile}>
              <Animated.Image
                source={require('./assets/couple.png')}
                style={[styles.coupleImgMobile, { transform: [{ translateY: coupleTranslate }] }]}
                resizeMode="contain"
              />
            </View>
            {/* Text block below */}
            <View style={styles.heroTextMobile}>
              <Text style={[styles.heroHeading,
                isWeb && { fontFamily: '"Playfair Display", Georgia, serif' }]}>
                Better Connection.{'\n'}Better Love.
              </Text>
              <Text style={[styles.heroScript,
                isWeb && { fontFamily: '"Great Vibes", cursive' }]}>
                Built on Intimacy.
              </Text>
              <Text style={styles.heroBodyMobile}>
                I help couples create deeper intimacy, heal, and build a
                relationship that feels safe, passionate, and unshakable.
              </Text>
              <TouchableOpacity style={styles.connectBtn} activeOpacity={0.85}>
                <Text style={styles.connectBtnText}>Let's Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* ── FEATURES ── */}
      {isDesktop ? (
        /* Desktop: single row with vertical dividers */
        <View style={styles.featuresDesktop}>
          {FEATURES.map((f, i) => (
            <View key={f.title} style={styles.featureRowDesktop}>
              <View style={styles.featureItemDesktop}>
                <Ionicons name={f.icon} size={38} color={C.copper} />
                <Text style={[styles.featureTitle, isWeb && { fontFamily: 'Georgia, serif' }]}>
                  {f.title}
                </Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
              {i < FEATURES.length - 1 && <View style={styles.featureDivider} />}
            </View>
          ))}
        </View>
      ) : (
        /* Mobile: 2×2 grid */
        <View style={styles.featuresMobile}>
          <View style={styles.featureGridRow}>
            {FEATURES.slice(0, 2).map((f, i) => (
              <View key={f.title} style={[styles.featureGridCell, i === 0 && styles.featureGridCellBorder]}>
                <Ionicons name={f.icon} size={32} color={C.copper} />
                <Text style={[styles.featureTitle, styles.featureTitleMobile,
                  isWeb && { fontFamily: 'Georgia, serif' }]}>
                  {f.title}
                </Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
          <View style={styles.featureGridDividerH} />
          <View style={styles.featureGridRow}>
            {FEATURES.slice(2, 4).map((f, i) => (
              <View key={f.title} style={[styles.featureGridCell, i === 0 && styles.featureGridCellBorder]}>
                <Ionicons name={f.icon} size={32} color={C.copper} />
                <Text style={[styles.featureTitle, styles.featureTitleMobile,
                  isWeb && { fontFamily: 'Georgia, serif' }]}>
                  {f.title}
                </Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
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
  navDesktop: {
    paddingHorizontal: 60,
    paddingVertical: 22,
  },
  logo: {
    color: C.white,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  logoWeb: {
    fontFamily: 'Georgia, serif',
    fontSize: 20,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 36,
  },
  navLinkText: { color: C.white, fontSize: 15, opacity: 0.9 },
  navLinkTextSm: { fontSize: 13 },
  bookBtn: {
    backgroundColor: C.blush,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 50,
  },
  bookBtnText: { color: '#1a0606', fontSize: 15, fontWeight: '600' },
  hamburger: { padding: 4, gap: 5 },
  hamburgerLine: {
    width: 24,
    height: 2,
    backgroundColor: C.white,
    borderRadius: 2,
    marginVertical: 2,
  },

  /* ── HERO shared ── */
  hero: { overflow: 'hidden', backgroundColor: C.bg },
  heroDesktop: { minHeight: 600 },
  heroMobile: { minHeight: 580 },
  heroBg: { position: 'absolute', top: 0, left: 0, right: 0, width: '100%' },
  heroBgDesktop: { height: 760 },
  heroBgMobile: { height: 700 },

  /* ── HERO desktop ── */
  heroRowDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 600,
  },
  heroOverlay: {
    paddingHorizontal: 28,
    paddingVertical: 60,
    justifyContent: 'center',
  },
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
    minWidth: 300,
    height: 600,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  /* ── HERO mobile ── */
  heroColMobile: { flex: 1, minHeight: 580 },
  heroCoupleWrapMobile: {
    alignItems: 'flex-end',
    paddingRight: 0,
    height: 300,
  },
  coupleImgMobile: { width: '75%', height: 300 },
  heroTextMobile: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 48,
  },
  heroBodyMobile: {
    color: C.muted,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 32,
  },

  /* ── HERO text (shared across breakpoints) ── */
  heroHeading: {
    color: C.white,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 44,
    marginBottom: 10,
  },
  heroHeadingDesktop: { fontSize: 54, lineHeight: 64, marginBottom: 12 },
  heroScript: {
    color: C.copper,
    fontSize: 36,
    fontStyle: 'italic',
    marginBottom: 22,
    lineHeight: 46,
  },
  heroScriptDesktop: { fontSize: 52, lineHeight: 60, marginBottom: 28 },
  heroBody: {
    color: C.muted,
    fontSize: 16,
    lineHeight: 28,
    marginBottom: 40,
  },
  connectBtn: {
    backgroundColor: C.blush,
    alignSelf: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 50,
  },
  connectBtnText: { color: '#1a0606', fontSize: 16, fontWeight: '600' },

  /* ── FEATURES desktop ── */
  featuresDesktop: {
    flexDirection: 'row',
    backgroundColor: C.maroon,
    paddingVertical: 64,
    paddingHorizontal: 60,
    alignItems: 'stretch',
  },
  featureRowDesktop: { flex: 1, flexDirection: 'row' },
  featureItemDesktop: { flex: 1, alignItems: 'center', paddingHorizontal: 32 },
  featureDivider: {
    width: 1,
    backgroundColor: C.divider,
    alignSelf: 'stretch',
  },

  /* ── FEATURES mobile ── */
  featuresMobile: {
    backgroundColor: C.maroon,
    paddingVertical: 40,
    paddingHorizontal: 0,
  },
  featureGridRow: { flexDirection: 'row' },
  featureGridCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  featureGridCellBorder: {
    borderRightWidth: 1,
    borderRightColor: C.divider,
  },
  featureGridDividerH: {
    height: 1,
    backgroundColor: C.divider,
    marginHorizontal: 24,
  },

  /* ── FEATURES shared ── */
  featureTitle: {
    color: C.white,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureTitleMobile: { fontSize: 16 },
  featureDesc: {
    color: '#d4b4a8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 160,
  },
});
