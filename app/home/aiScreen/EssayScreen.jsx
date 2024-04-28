

const EssayScreen = () => {

    const [translate] = useLanguage();

    const [scannedImage, setScannedImage] = useState([]);
    const [text, setText] = useState()
    const [isFocused, setIsFocused] = useState(false);
    const [extractingText, setExtractingText] = useState(false);

    const [topic, setTopic] = useState("")
    const [topicError, setTopicError] = useState("")
    const [topicContent, setTopicContent] = useState("")
    const [topicContentError, setTopicContentError] = useState("")
    const [topicSelected, setTopicSelected] = useState(false)
    const [topicContentSelected, setTopicContentSelected] = useState(false)
    const [aiEssayCheckUsagesExceeded, setAiEssayCheckUsagesExceeded] = useState(false)
    const [aiEssayCheckMaxUsages, setAiEssayCheckMaxUsages] = useState('')
    

    const [pending, setPending] = useState(false)
    const [aiFeedback, setAiFeedback] = useState("")

    const { authState } = useAuth();
    const token = authState.token

    const { setKeyboardOpen, roles, aiEssayCheckUsages, setAiEssayCheckUsages } = useStore()

    const scanDocument = async () => {
        // start the document scanner
        const { scannedImages } = await DocumentScanner.scanDocument({
            maxNumDocuments: 3
        })

        // get back an array with scanned image file paths
        if (scannedImages.length > 0) {
            // set the img src, so we can view the first scanned image
            setScannedImage(scannedImages)
        }
    }

    const sendEssayToAi = async () => {
        if (topic.length < 3) {
            setTopicError(translate('essayScreen.topicTextInputError'))
        }
        else if (topicContent.length < 10) {
            setTopicContentError(translate('essayScreen.topicContentTextInputError'))
        } else {
            setPending(true)
            const aiText = await GetFeedbackOnEssayQuery(token, topic, topicContent)

            setAiFeedback(aiText.text)
            setAiEssayCheckUsages(aiText.aiEssayCheckUsages)

            const exceeded = aiEssayCheckUsages >= (roles.includes("ADMINISTRATOR") ? Infinity : roles.includes("TESTER") ? 10 : 5)
            const maxUsages = roles.includes("ADMINISTRATOR") ? '∞' : roles.includes("TESTER") ? '10' : '5'
            setAiEssayCheckUsagesExceeded(exceeded)
            setAiEssayCheckMaxUsages(maxUsages)

            console.log(aiText.text)
            setPending(false)
        }
    }


    useEffect(() => {
        if (topicSelected || topicContentSelected) {
            setKeyboardOpen(true)
        } else {
            setKeyboardOpen(false)
        }
    }, [topicSelected, topicContentSelected])


    useEffect(() => {
        // call scanDocument on load
        const getText = async () => {
            setExtractingText(true)

            console.log(scannedImage[0])

            // uploadImage(scannedImage[0])
            // const results = await TextRecognition.recognize(scannedImage[0]);
            // setText(results.text)
            setAiFeedback("")
            setTopicContent("")
            let content = ""
            for (let i = 0; i < scannedImage.length; i++) {
                console.log("sending")
                const retrievedText = await SendImage(scannedImage[i]);
                content = content + retrievedText
            }
            setTopicContent(content);
            console.log("extracted")
            console.log("-----------------------------------------------");
            console.log(content);
            console.log("-----------------------------------------------");
            if (content.length < 1) {
                setTopicContent("Something went wrong...")
                setTopicContentError("")
                setScannedImage([])
                setExtractingText(false)
                return;
            }

            console.log("called fixWritten api")
            const text = await FixWrittenText(token, topic, content)
            console.log("done with calling the fixWritten api")
            if (text.text) {
                setTopicContent(text.text)
            } else {
                setTopicContent("Something went wrong...")
            }



            // setTopicContent(content)
            setTopicContentError("")
            setScannedImage([])
            setExtractingText(false)
        }



        if (scannedImage[0]) {
            getText()
            return;
        } else return;
    }, [scannedImage]);


    useMemo(() => {
        // console.log("wokookokok")
        const exceeded = aiEssayCheckUsages >= (roles.includes("ADMINISTRATOR") ? Infinity : roles.includes("TESTER") ? 10 : 5)
        const maxUsages = roles.includes("ADMINISTRATOR") ? '∞' : roles.includes("TESTER") ? '10' : '5'
        // console.log(exceeded)
        // console.log(maxUsages)
        setAiEssayCheckUsagesExceeded(exceeded)
        setAiEssayCheckMaxUsages(maxUsages)
     }, []);
     

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                {/* <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            > */}
                <View>
                    {["TESTER", "ADMINISTRATOR"].some(role => roles.includes(role)) && (

                        <TouchableOpacity
                            style={[styles.callToScanContainer, { marginTop: 30 }]}
                            onPress={() => {
                                scanDocument()
                            }}
                        >
                            <Text
                                style={styles.callToScanContainerText}
                            >
                                {translate('essayScreen.scannerButtonHeader')}
                            </Text>
                            <AntDesign
                                name="scan1"
                                size={39}
                                color={'#fff'}
                                style={{
                                    backgroundColor: "#02cfc5",
                                    padding: 5,
                                    borderRadius: 5
                                }}
                            />
                        </TouchableOpacity>
                    )}
                    <Text
                        style={styles.mainText}
                    >
                        {translate('essayScreen.mainHeader')}
                    </Text>
                    <Text
                        style={styles.mainAiText}
                    >
                        {translate('essayScreen.mainDescription')}
                    </Text>
                </View>
                <Text
                    style={styles.label}
                >
                    {translate('essayScreen.topicTextInputLabel')}
                </Text>
                {topicSelected ? (
                    <View>
                        <TextInput
                            style={[styles.textArea, styles.focused]}
                            placeholder={translate('essayScreen.topicTextInputPlaceholder')}
                            multiline={true}
                            placeholderTextColor={"#8979D5"}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTopicSelected(false)}
                            onChangeText={(text) => {
                                setTopic(text); // Assuming setTopic is a function to update your state
                                setTopicError(""); // Resetting the error state
                            }}
                            value={topic}
                            autoFocus={true}
                            scrollEnabled={true}
                        />
                        <Text style={{ color: "#FF3232", marginBottom: 20 }}>
                            {topicError}
                        </Text>
                    </View>
                ) : (
                    <View>
                        <TouchableOpacity
                            style={[styles.textArea, styles.unfocused]}
                            onPress={() => { setTopicSelected(true) }}
                        >
                            <Text style={[styles.textAreaMockupText, topic.length === 0 && { color: "#8979D5" }]}>
                                {topic.length > 0 ? topic : translate('essayScreen.topicTextInputPlaceholder')}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ color: "#FF3232", marginBottom: 10 }}>
                            {topicError}
                        </Text>
                    </View>
                )}
                <Text
                    style={styles.label}
                >
                    {translate('essayScreen.topicContentTextInputLabel')}
                </Text>
                {extractingText ? (
                    <View style={styles.waitingTextArea}>
                        <ActivityIndicator size={'large'} color="#A59CFB" />
                    </View>
                ) : topicContentSelected ? (

                    <View>
                        <TextInput
                            style={[styles.textArea, styles.focused, { maxHeight: 300, }]}
                            placeholder={translate('essayScreen.topicContentTextInputPlaceholder')}
                            multiline={true}
                            placeholderTextColor={"#8979D5"}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTopicContentSelected(false)}
                            onChangeText={(text) => {
                                setTopicContent(text); // Assuming setTopic is a function to update your state
                                setTopicContentError(""); // Resetting the error state
                            }}
                            value={topicContent}
                            autoFocus={true}
                            scrollEnabled={true}

                        />
                        <Text style={{ color: "#FF3232", marginBottom: 20 }}>
                            {topicContentError}
                        </Text>
                    </View>

                ) : (
                    <View>
                        <TouchableOpacity
                            style={[styles.textArea, styles.unfocused]}
                            onPress={() => setTopicContentSelected(true)}
                        >
                            <Text style={[styles.textAreaMockupText, topicContent.length === 0 && { color: "#8979D5" }]}>
                                {topicContent.length > 0 ? topicContent : translate('essayScreen.topicContentTextInputPlaceholder')}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ color: "#FF3232", marginBottom: 20 }}>
                            {topicContentError}
                        </Text>
                    </View>
                )}
                <View style={[{ display: 'flex', gap: 10 }, scannedImage.length > 0 ? { marginTop: 20, marginBottom: 20, } : { marginBottom: 10 }]}>
                    {scannedImage && scannedImage.map((imagePath, index) => (
                        <View>
                            {/* <Text>{imagePath}</Text> */}
                            <Image
                                key={index} // It's important to provide a unique key for each child in a list
                                source={{ uri: imagePath }}
                                style={{ width: 200, height: 200, borderRadius: 10 }} // Adjust the width and height as needed
                            />
                        </View>
                    ))}
                </View>
                {aiFeedback && aiFeedback.length > 0 && (
                    <View style={{ marginBottom: 40 }}>
                        <Text style={{ marginBottom: 20, marginTop: -20, textAlign: 'center', color: '#fff', fontSize: 26, fontWeight: 700 }}>
                            Ответ ИИ
                        </Text>
                        <View
                            style={[styles.textArea, styles.unfocused]}
                        >
                            {/* style={styles.textAreaMockupText} */}
                            <Markdown
                                style={{
                                    body: { color: 'white', fontSize: 16 },
                                    heading1: { color: 'purple' },
                                    code_block: { color: 'black', fontSize: 14 }
                                }}
                            >
                                {aiFeedback}
                            </Markdown>
                        </View>
                    </View>
                )}
                <TouchableOpacity
                    onPress={() => sendEssayToAi()}
                    style={[
                        styles.send,
                        aiEssayCheckUsagesExceeded && { borderColor: "#FF3232" }
                    ]}
                    disabled={extractingText || aiEssayCheckUsagesExceeded}
                >
                    {pending ? (
                        <ActivityIndicator size={'large'} color="#A59CFB" />
                    ) : (
                        <View>
                            <View
                                style={styles.sendContent}
                            >
                                {aiEssayCheckUsagesExceeded ? (
                                    <Text
                                        style={{ fontSize: 30, fontWeight: '700', color: '#FF3232' }}
                                    >
                                        {translate('essayScreen.sendButtonUsedAllTriesText')}
                                    </Text>
                                ) : (
                                    <View style={styles.sendContent}>
                                        <Text style={styles.sendText}>
                                            {aiFeedback && aiFeedback.length > 0 ? translate('essayScreen.sendButtonResendText') : translate('essayScreen.sendButtonSendText')}
                                        </Text>
                                        <MaterialCommunityIcons
                                            name="robot-happy-outline"
                                            size={30}
                                            color={'#A59CFB'}
                                            style={{
                                                padding: 5
                                            }}
                                        />
                                    </View>
                                )
                                }
                            </View>
                            {/* ["TESTER", "ADMINISTRATOR"] */}
                            <View style={{ marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 }}>
                                <Text style={{ color: '#fff', fontSize: 18 }}>
                                {translate('essayScreen.sendButtonUsedText')}
                                </Text>
                                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
                                    {aiEssayCheckUsages} / {aiEssayCheckMaxUsages}
                                </Text>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
                <View style={styles.emptyness}>

                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

export default EssayScreen

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: "#271D59",
        // padding: 20,
        // paddingTop: 40
    },
    scrollView: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    callToScanContainer: {
        color: "#fff",
        alignItems: 'center',
        borderRadius: 40,
        backgroundColor: "#614EBF",
        borderStyle: 'solid',
        borderColor: '#fff',
        borderWidth: 2,
        paddingTop: 10,
        paddingBottom: 10,
        // marginBottom: 40,
        marginTop: 40
    },
    callToScanContainerText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: "#fff",
        marginBottom: 10
    },
    mainText: {
        color: "#fff",
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
        marginTop: 40,
    },
    mainAiText: {
        color: "#fff",
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: 'bold'
    },
    label: {
        color: "#C5BAFA",
        fontSize: 16,
        marginBottom: 10,
        fontWeight: '700'
    },
    waitingTextArea: {
        textAlignVertical: 'top',
        justifyContent: "flex-start",
        backgroundColor: 'transparent',
        color: '#fff',
        fontSize: 20,
        letterSpacing: 1,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#514978",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
    },
    textArea: {
        textAlignVertical: 'top',
        justifyContent: "flex-start",
        backgroundColor: 'transparent',
        color: '#fff',
        fontSize: 20,
        letterSpacing: 1,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#514978",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
    },
    textAreaMockupText: {
        color: '#fff',
        fontSize: 20,
    },
    focused: {
        borderColor: '#CCC3F9', // Change to your desired focused border color
    },
    unfocused: {
        borderColor: '#514978', // Change to your desired unfocused border color
    },
    send: {
        width: '100%',
        backgroundColor: '#201f47',
        borderWidth: 2,
        borderColor: '#02cfc5',
        borderRadius: 20,
        padding: 15
    },
    sendContent: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    sendText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '700',

    },
    emptyness: {
        height: 150
    }
})