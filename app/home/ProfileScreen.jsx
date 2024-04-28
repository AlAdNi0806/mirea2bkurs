

const ReusableModal = ({ isVisible, onClose, onChangeText, onSubmitText, title, inputTextLabel, inputFieldError, placeHolderText, submitButtonText, pending }) => {
  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      transparent={true}
      onRequestClose={() => {
        onClose();
      }}
      statusBarTranslucent={true}
      style={styles.centeredView}

    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.modalBackdrop}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <View style={styles.modalClose}>
                <Pressable
                  onPress={() => onClose()}
                >
                  <AntDesign name={"close"} size={26} color="#fff" />
                </Pressable>
              </View>
              <Text style={styles.modalTitle}>
                {title}
              </Text>
              <View style={{ marginBottom: 20, }}>
                <Text style={styles.textInputLabel}>
                  {inputTextLabel}
                </Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => onChangeText(text)}
                  autoCapitalize="none"
                  placeholderTextColor={'#8A80F2'}
                  placeholder={placeHolderText}
                />
                <Text style={{ color: '#FF3232', }}>
                  {inputFieldError}
                </Text>
              </View>
              <View>
                {pending ? (
                  <View style={styles.submitButton}>
                    <ActivityIndicator
                      size={'large'}
                      color="#A59CFB"
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => onSubmitText()}
                    style={styles.submitButton}
                  >
                    <Text style={styles.submitButtonText}>
                      {submitButtonText}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}



const ProfileScreen = () => {
  const [translate, setLang, lang] = useLanguage();

  const [userDetails, setUserDetails] = useState(null)
  const [fullNameModalVisible, setFullNameModalVisible] = useState(false);
  const [newName, setNewName] = useState('')
  const [newNameFieldError, setNewNameFieldError] = useState('')
  const [pending, setPending] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackError, setFeedbackError] = useState('')

  const data = [
    { label: 'Eng', short: 'en', value: '1' },
    { label: 'Рус', short: 'ru', value: '2' },
  ];

  const initialLanguageValue = data.find(item => item.short === lang)?.value || '1';

  const [language, setLanguage] = useState(initialLanguageValue);
  const [isLanguageFocus, setIsLanguageFocus] = useState(false);

  const { authState, onLogout } = useAuth();
  const token = authState.token

  const { roles, setRoles, setSentBecomeTesterRequest, setAiEssayCheckUsages, setKeyboardOpen } = useStore()

  const viewRef = useRef(null);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const getUserDetails = async () => {
  //       try {
  //         const details = await GetUserDetails(token);
  //         setUserDetails(details.user);
  //         setRoles(details.user.roles);
  //       } catch (error) {
  //         console.error("Failed to fetch user details:", error);
  //         // Handle the error appropriately
  //       }
  //     };

  //     getUserDetails();
  //   }, []) // Add any dependencies here
  // );

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const details = await GetUserDetails(token);
        const date = parseISO(details.user.createdAt);
        const formattedDate = format(date, 'dd-MM-yyyy - HH:mm');

        const condDetails = { ...details.user, createdAt: formattedDate };

        setUserDetails(condDetails);
        setRoles(details.user.roles);

        const hasBecomeTesterRequest = details.user.requests.some(request => request.type === 'becomeTester')
        setSentBecomeTesterRequest(hasBecomeTesterRequest)

        setAiEssayCheckUsages(details.user.aiEssayCheckUsages)
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        // Handle the error appropriately
      }
    };

    getUserDetails();
  }, []);


  const changeFullName = async () => {
    setPending(true)
    setNewNameFieldError("")
    if (newName.length < 3) {
      console.log("wofdofisjpadvoij")
      setNewNameFieldError(translate('profileScreen.modalFullNameTextInputShorterThanThree'))
      setPending(false)
      return;
    }

    const details = await ChangeUserFullName(token, newName)
    const date = parseISO(details.user.createdAt);
    const formattedDate = format(date, 'dd-MM-yyyy - HH:mm');
    // console.log(formattedDate)
    const condDetails = { ...details.user, createdAt: formattedDate };
    // setUserDetails(details.user);
    setUserDetails(condDetails);
    setRoles(details.user.roles);
    setNewName("")
    setFullNameModalVisible(false)
    setPending(false)
  }

  const changeLanguage = async (language) => {
    const user = await ChangeLanguage(token, language)
    setLang(user.user.language);
    // console.log(user.user)
  }

  const submitFeedback = async () => {
    setPending(true)
    setFeedbackError("")
    if (feedback.length < 3) {
      setFeedbackError(translate('profileScreen.feedbackTextInputShorterThanThree'))
      setPending(false)
      return;
    } else if (feedback.length > 500) {
      setFeedbackError(translate('profileScreen.feedbackTextInputShorterLongerThanFiveHundred'))
      setPending(false)
      return;
    }

    const details = await GiveFeedback(token, feedback)

    Notifier.showNotification({
      title: 'SUCCESS!',
      description: 'We successfully received your feedback, thanks!',
      duration: 0,
      showAnimationDuration: 800,
      showEasing: Easing.bounce,
      onHidden: () => console.log('Hidden'),
      onPress: () => console.log('Press'),
      hideOnPress: false,
      duration: 5000,
      Component: NotifierComponents.Notification,
      componentProps: {
        containerStyle: { marginTop: 40, backgroundColor: '#201f47', borderWidth: 2, borderColor: '#02cfc5', borderRadius: 20, height: 100 },
        titleStyle: { color: '#fff', fontSize: 20, fontWeight: '700' },
        descriptionStyle: { color: '#fff' }
      },
    });

    setPending(false)
  }

  const renderLabel = () => {
    if (language || isLanguageFocus) {
      return (
        <Text style={[styles.label, isLanguageFocus && { color: 'blue' }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>

      <Image style={styles.image} source={require('../assets/main/city.png')} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.logoutWrapper}>
          <TouchableOpacity
            onPress={() => (
              onLogout()
            )}
            style={styles.logout}
          >
            <Text style={styles.logoutText}>
              {translate('profileScreen.logout')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoContentContainer}>
            {userDetails ? (
              <View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.usernameText}>
                    {userDetails.username}
                  </Text>
                  <Dropdown
                    style={[styles.dropdown, { borderColor: '#fff', borderWidth: 1 }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={{ ...styles.selectedTextStyle, color: 'white' }}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={data}
                    // search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isLanguageFocus ? 'Select item' : '...'}
                    searchPlaceholder="Search..."
                    value={language}
                    onFocus={() => setIsLanguageFocus(true)}
                    onBlur={() => setIsLanguageFocus(false)}
                    onChange={item => {
                      changeLanguage(item.short)
                      setLang(item.short)
                      setLanguage(item.value);
                      setIsLanguageFocus(false);
                    }}
                    renderLeftIcon={() => (
                      <Ionicons
                        style={styles.icon}
                        color={isLanguageFocus ? '#fff' : '#fff'}
                        name="language"
                        size={20}
                      />
                    )}
                  />
                </View>
                <View style={styles.separator} />
                <View style={styles.rolesWrapper}>
                  <Text style={styles.wrapperTitle}>
                    {translate('profileScreen.roles')}
                  </Text>
                  <View style={styles.roles}>
                    {roles.map((role, index) => (
                      <View key={index} style={styles.role}>
                        <Text style={{ color: "#fff", fontSize: 16, textTransform: 'lowercase' }}>
                          {role}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.fullNameWrapper}>
                  <Text style={styles.wrapperTitle}>
                    {translate('profileScreen.fullName')}
                  </Text>
                  <TouchableOpacity
                    style={styles.fullNameWrapperContent}
                    onPress={() => setFullNameModalVisible(true)}
                  >
                    <Text style={styles.fullNameWrapperContentTitle}>
                      {userDetails.fullName}
                    </Text>
                    <AntDesign name={"edit"} size={26} color="#fff" />
                  </TouchableOpacity>
                  <ReusableModal
                    isVisible={fullNameModalVisible}
                    onClose={() => setFullNameModalVisible(false)}
                    title={translate('profileScreen.modalFullNameTitle')}
                    inputTextLabel={translate('profileScreen.modalFullNameTextInputLabel')}
                    placeHolderText={translate('profileScreen.modalFullNameTextInputPlaceholder')}
                    submitButtonText={translate('profileScreen.modalFullNameTextInputSubmit')}
                    onChangeText={(text) => setNewName(text)}
                    onSubmitText={() => changeFullName()}
                    inputFieldError={newNameFieldError}
                    pending={pending}
                  />
                </View>
                <View style={styles.accountCreatedAtWrapper}>
                  <Text style={styles.wrapperTitle}>
                    {translate('profileScreen.accountCreatedAt')}
                  </Text>
                  <View style={styles.accountCreatedAtWrapperContent}>
                    <Text style={styles.accountCreatedAtWrapperContentTitle}>
                      {userDetails.createdAt}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={{ width: 'auto', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator
                  size={'large'}
                  color="#A59CFB"
                />
              </View>
            )}
          </View>
        </View>
        <View style={styles.centeredFeedbackView}>
          <View style={styles.feedbackView}>
            <Text style={styles.feedbackTitle}>
              {translate('profileScreen.feedbackTitle')}
            </Text>
            <Text style={{ color: '#fff', fontSize: 20, textAlign: 'center', fontWeight: '600', marginBottom: 30 }}>
              {translate('profileScreen.feedbackDescription')}
            </Text>
            <View style={{ marginBottom: 20, }}>
              {/* <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => onChangeText(text)}
                  autoCapitalize="none"
                  placeholderTextColor={'#8A80F2'}
                  placeholder={'placeHolderText'}
                /> */}

              <View
                style={{
                  borderRadius: 12,
                  shadowRadius: 8,
                  shadowOpacity: 0.2,
                  shadowColor: "#757575",
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  marginBottom: 15
                }}
              >
                <RNTextArea
                  maxCharLimit={500}
                  style={{ height: 200, borderRadius: 12, width: 'auto', backgroundColor: "#3E3C8D", marginBottom: 10 }}
                  textInputStyle={{ textAlignVertical: 'top', color: '#fff', fontSize: 18, paddingTop: 0, paddingBottom: 24 }}
                  // defaultCharCount={100}
                  placeholderTextColor="#aaa2fc"
                  exceedCharCountColor="#ff3434"
                  placeholder={translate('profileScreen.feedbackTextInputPlaceholder')}
                  value={feedback}
                  onChangeText={(text) => {
                    if (text.length > 3 && text.length <= 500) {
                      setFeedbackError('')
                    }
                    setFeedback(text)
                  }}
                  onFocus={() => setKeyboardOpen(true)}
                  onBlur={() => setKeyboardOpen(false)}
                />
                {feedbackError.length > 0 && (
                  <Text style={{ color: '#ff3434', }}>
                    {feedbackError}
                  </Text>
                )}
              </View>
            </View>
            <View style={{ marginBottom: 10 }}>
              {pending ? (
                <View style={styles.submitButton}>
                  <ActivityIndicator
                    size={'large'}
                    color="#A59CFB"
                  />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => submitFeedback()}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>
                    {translate('profileScreen.feedbackSubmit')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={styles.emptyness} />
      </KeyboardAwareScrollView>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    position: 'absolute',
    transform: [
      { scaleX: 3.5 },
      { translateX: -125 }
    ]
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent'
  },

  logoutWrapper: {
    padding: 20,
    paddingTop: 60
  },
  logout: {
    width: '100%',
    backgroundColor: '#201f47',
    borderWidth: 2,
    borderColor: '#02cfc5',
    borderRadius: 20,

    padding: 20
  },
  logoutText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center'
  },





  infoContainer: {
    width: '100%',
    padding: 20,
  },
  infoContentContainer: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#796CFF', // Example border color
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 20,
    display: 'flex',
    elevation: 10,
  },
  usernameText: {
    color: '#02cfc5',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10
  },
  rolesWrapper: {
    // display: 'flex',
    // flexDirection: 'row',
    // gap: 20,
    marginBottom: 20
  },
  wrapperTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    // width: 60
  },
  roles: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  fullNameWrapper: {
    // display: 'flex',
    // flexDirection: 'row',
    // gap: 20,
    marginBottom: 20
  },
  fullNameWrapperContent: {
    marginTop: -20,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  fullNameWrapperContentTitle: {
    color: '#fff',
    fontSize: 20,
  },
  accountCreatedAtWrapper: {
    marginBottom: 10,
    marginTop: -10,
  },
  accountCreatedAtWrapperContent: {
    marginTop: -20,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  accountCreatedAtWrapperContentTitle: {
    color: '#fff',
    fontSize: 20,
  },
  role: {
    borderWidth: 2,
    borderColor: '#796CFF', // Example border color
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingVertical: 2

  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 15,
  },




  centeredView: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    paddingHorizontal: 20
  },
  modalView: {
    padding: 20,
    width: '100%',
    backgroundColor: "rgba(33,31,80, 0.9)",
    borderColor: 'rgb(67,68,136)',
    borderWidth: 2,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalClose: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: 10
  },
  modalTitle: {
    width: '100%',
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40
  },
  textInputLabel: {
    color: '#afa8fa',
    fontSize: 16,

    marginBottom: 10
  },
  textInput: {
    borderRadius: 8,
    backgroundColor: "#3E3C8D",
    color: '#fff',
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3a3869',
    color: '#fff',
    borderWidth: 2,
    borderColor: "#A59CFB",
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1
  },

  centeredFeedbackView: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20
  },
  feedbackView: {
    padding: 20,
    width: '100%',
    backgroundColor: "rgba(33,31,80, 0.98)",
    borderColor: '#796CFF',
    borderWidth: 2,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20
  },
  feedbackTitle: {
    width: '100%',
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 10
  },




  dropdown: {
    width: 120,
    height: 50,
    borderWidth: 2,
    borderColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    color: '#fff',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    display: 'none'
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },




  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Semi-transparent black background
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  emptyness: {
    height: 120
  }
})