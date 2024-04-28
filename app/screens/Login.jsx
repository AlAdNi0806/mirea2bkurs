


const Login = () => {
    let contentRef;

    const [translate] = useLanguage();

    const [loginError, setLoginError] = useState('')
    const [registerError, setRegisterError] = useState('')
    const [pending, setPending] = useState(false)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const { onLogin, onRegister } = useAuth('')

    const [isFocused, setIsFocused] = useState(false);


    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };


    const login = async () => {
        setPending(true)
        setLoginError('')
        console.log("working")

        if (loginUsername.length < 1) {
            setLoginError(translate('loginScreen.loginUsernameTextInputError'))
            setPending(false)
            return;
        } else if (loginPassword.length < 1) {
            setLoginError(translate('loginScreen.loginPasswordTextInputError'))
            setPending(false)
            return;
        }

        const result = await onLogin(loginUsername, loginPassword);
        console.log(result)
        if (result.success === true) {
            setPending(false)
            return;
        } else {
            if (result.message.message === "Wrong username or password") {
                setLoginError(translate('loginScreen.loginError'))
            } else {
                setLoginError(result.message.message)
            }
            setPending(false)
        }
    }

    const register = async () => {
        setPending(true)
        setRegisterError('')

        if (fullName.length < 3) {
            setRegisterError(translate('loginScreen.registerFullNameTextInputError'))
            setPending(false)
            return;
        } else if (username.length < 2) {
            setRegisterError(translate('loginScreen.registerUsernameTextInputError'))
            setPending(false)
            return;
        } else if (password.length < 5) {
            setRegisterError(translate('loginScreen.registerPasswordTextInputError'))
            setPending(false)
            return;
        }

        const result = await onRegister(fullName, username, password);
        if (result.success === true) {
            onLogin(username, password)
            setPending(false)
        } else {
            if (result.message.message === "User already exists") {
                setRegisterError(translate('loginScreen.registerError'))
            } else {
                setRegisterError(result.message.message)
            }
            setPending(false)
            console.log(registerError)
        }
    }


    const goToRegister = async () => {
        contentRef.scrollToIndex({ animated: true, index: 1 })
        // await sleep(100);
        // setCurrentForm('register');
    }
    const goToLogin = async () => {
        contentRef.scrollToIndex({ animated: true, index: 0 })
        // await sleep(100);
        // setCurrentForm('login');
    }


    const forms = [
        {
            id: 'login',
            title: translate('loginScreen.mainLoginHeader'),
            fields: [
                { label: translate('loginScreen.loginUsernameTextInputLabel'), placeholder: translate('loginScreen.loginUsernameTextInputPlaceholder'), value: username, onChangeText: setLoginUsername },
                { label: translate('loginScreen.loginPasswordTextInputLabel'), placeholder: '*****', value: password, onChangeText: setLoginPassword, secureTextEntry: true },
            ],
            error: loginError,
            button: { title: translate('loginScreen.loginSubmitText'), onPress: login },
            switchAuthenticationMethodButton: { title: translate('loginScreen.loginSwitchToRegister'), onPress: goToRegister }
        },
        {
            id: 'register',
            title: translate('loginScreen.mainRegisterHeader'),
            fields: [
                { label: translate('loginScreen.registerFullNameTextInputLabel'), placeholder: translate('loginScreen.registerFullNameTextInputPlaceholder'), value: fullName, onChangeText: setFullName },
                { label: translate('loginScreen.registerUsernameTextInputLabel'), placeholder: translate('loginScreen.registerUsernameTextInputPlaceholder'), value: username, onChangeText: setUsername },
                { label: translate('loginScreen.registerPasswordTextInputLabel'), placeholder: '*****', value: password, onChangeText: setPassword, secureTextEntry: true },
            ],
            error: registerError,
            button: { title: translate('loginScreen.registerSubmitText'), onPress: register },
            switchAuthenticationMethodButton: { title: translate('loginScreen.registerSwitchToLogin'), onPress: goToLogin }
        },
    ];





    return (
        <ImageBackground source={require('../assets/main/city.png')} style={styles.imageBackground}>
            <View>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                >
                    <FlatList
                        style={styles.inner}
                        data={forms}
                        horizontal={true}
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        ref={(ref) => { contentRef = ref }}
                        keyboardShouldPersistTaps='handled'
                        scrollEnabled={!isFocused}
                        // onViewableItemsChanged={onViewableItemsChanged}
                        // viewabilityConfig={viewabilityConfig}
                        snapToInterval={Dimensions.get('screen').width}
                        bounces={false}
                        renderItem={({ item, index }) => (
                            // <KeyboardAvoidingView
                            //     behavior={Platform.OS === "ios" ? "padding" : "height"}
                            //     keyboardVerticalOffset={75}
                            // >
                            <View style={{ width: Dimensions.get('screen').width, paddingTop: 100, paddingBottom: 50, paddingLeft: 20, paddingRight: 20 }}>
                                <View style={styles.container}>
                                    <View style={styles.circle}>
                                        <Image
                                            source={require('../assets/main/logo.jpg')}
                                            style={styles.image}
                                        />
                                    </View>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <View style={styles.form}>
                                        {item.fields.map((field, index) => (
                                            <View key={index}>
                                                <Text style={styles.label}>
                                                    {field.label}
                                                </Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder={field.placeholder}
                                                    onChangeText={field.onChangeText}
                                                    secureTextEntry={field?.secureTextEntry}
                                                    onFocus={handleFocus}
                                                    onBlur={handleBlur}
                                                    placeholderTextColor={'#8A80F2'}
                                                    autoCapitalize="none"
                                                />
                                            </View>
                                        ))}
                                        <Text style={styles.errorText}>
                                            {item.error}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={item.button.onPress}
                                            style={styles.buttonContainer}
                                            disabled={pending}
                                        >
                                            {pending ? (
                                                <ActivityIndicator
                                                    size={'large'}
                                                    color="#A59CFB"
                                                />
                                            ) : (
                                                <Text style={styles.buttonText}>{item.button.title}</Text>
                                            )}
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={item.switchAuthenticationMethodButton.onPress}
                                            style={styles.linkButton}
                                        >
                                            <Text style={styles.linkButtonText}>
                                                {item.switchAuthenticationMethodButton.title}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            // </KeyboardAvoidingView>
                        )}
                    />
                </KeyboardAwareScrollView>
            </View>
        </ImageBackground>
    )
}



export default Login