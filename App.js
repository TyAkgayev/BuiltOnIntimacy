import { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Animated,
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

// Replace with your actual contact email or booking URL
const CONTACT_EMAIL = 'hello@builtonintimacy.com';

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

  // couple.png is 1536×1024 (1.5:1). Width drives size so the container
  // matches the natural ratio — no letterboxing, no floating.
  const COUPLE_RATIO = 1536 / 1024;
  const coupleW = Math.max(300, Math.min(780, width * 0.45));
  const coupleH = Math.round(coupleW / COUPLE_RATIO);

  const scrollY = useRef(new Animated.Value(0)).current;

  const [menuOpen, setMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');

  const openForm = () => {
    setSubmitted(false);
    setName('');
    setContact('');
    setMessage('');
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (!name.trim() || !contact.trim()) return;
    const subject = encodeURIComponent('New Inquiry — BuiltOnIntimacy.com');
    const body = encodeURIComponent(
      `Name: ${name}\nContact: ${contact}${message ? `\n\nMessage:\n${message}` : ''}`
    );
    Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`);
    setSubmitted(true);
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

  return (
    <>
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
              <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85} onPress={openForm}>
                <Text style={styles.bookBtnText}>Book a Call</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.hamburger} activeOpacity={0.7} onPress={() => setMenuOpen(true)}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── HERO ── */}
        <View style={[styles.hero, isDesktop ? styles.heroDesktop : styles.heroMobile]}>
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
                <TouchableOpacity style={styles.connectBtn} activeOpacity={0.85} onPress={openForm}>
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
            <View style={styles.heroColMobile}>
              <View style={styles.heroCoupleWrapMobile}>
                <Animated.Image
                  source={require('./assets/couple.png')}
                  style={[styles.coupleImgMobile, { transform: [{ translateY: coupleTranslate }] }]}
                  resizeMode="cover"
                />
              </View>
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
                <TouchableOpacity style={styles.connectBtn} activeOpacity={0.85} onPress={openForm}>
                  <Text style={styles.connectBtnText}>Let's Connect</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* ── FEATURES ── */}
        {isDesktop ? (
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

      {/* ── MOBILE NAV MENU ── */}
      <Modal
        visible={menuOpen}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={styles.mobileMenu}>
          <View style={styles.mobileMenuHeader}>
            <Text style={[styles.logo, isWeb && styles.logoWeb]}>BuiltOnIntimacy.com</Text>
            <TouchableOpacity onPress={() => setMenuOpen(false)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="close" size={28} color={C.white} />
            </TouchableOpacity>
          </View>
          {NAV_LINKS.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.mobileMenuLink}
              activeOpacity={0.7}
              onPress={() => setMenuOpen(false)}
            >
              <Text style={[styles.mobileMenuLinkText, isWeb && { fontFamily: 'Georgia, serif' }]}>{item}</Text>
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
          <ScrollView
            contentContainerStyle={styles.formScroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formHeader}>
              <Text style={[styles.formTitle, isWeb && { fontFamily: '"Playfair Display", Georgia, serif' }]}>
                Get in Touch
              </Text>
              <TouchableOpacity onPress={() => setFormOpen(false)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Ionicons name="close" size={28} color={C.white} />
              </TouchableOpacity>
            </View>

            {submitted ? (
              <View style={styles.formSuccess}>
                <Ionicons name="checkmark-circle" size={72} color={C.copper} />
                <Text style={[styles.formSuccessTitle, isWeb && { fontFamily: '"Playfair Display", Georgia, serif' }]}>
                  Thank you!
                </Text>
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
                  style={[styles.connectBtn, styles.formSubmitBtn, (!name.trim() || !contact.trim()) && styles.formSubmitDisabled]}
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
    </>
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
    height: 360,
    overflow: 'hidden',
  },
  coupleImgMobile: { width: '100%', height: 360 },
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

  /* ── HERO text (shared) ── */
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

  /* ── MOBILE NAV MENU ── */
  mobileMenu: {
    flex: 1,
    backgroundColor: C.bg,
  },
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
  mobileMenuLinkText: {
    color: C.white,
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  mobileMenuBookBtn: {
    backgroundColor: C.blush,
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 50,
    marginTop: 48,
  },

  /* ── CONTACT FORM ── */
  formScroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 48,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  formTitle: {
    color: C.white,
    fontSize: 26,
    fontWeight: '700',
  },
  formSubtitle: {
    color: C.muted,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 32,
  },
  formLabel: {
    color: C.blush,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
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
  formTextArea: {
    height: 120,
  },
  formSubmitBtn: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 8,
  },
  formSubmitDisabled: {
    opacity: 0.45,
  },
  formSuccess: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 20,
  },
  formSuccessTitle: {
    color: C.white,
    fontSize: 32,
    fontWeight: '700',
  },
  formSuccessBody: {
    color: C.muted,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 12,
  },
});
