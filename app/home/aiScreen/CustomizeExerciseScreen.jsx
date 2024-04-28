


const CustomizeExerciseScreen = () => {

  const [translate] = useLanguage();

  const [currentSelectedExercises, setCurrentSelectedExercises] = useState([]);
  const [opacity, setOpacity] = useState(1);
  const [pending, setPending] = useState(false);

  const { currentSubject, currentSubjectExercises, setCurrentSubjectSelectedExercises } = useStore();
  const navigation = useNavigation();


  const ASPECT_RATIO = 1; // Example aspect ratio
  const { width } = Dimensions.get('window');
  const CARD_WIDTH = width * 0.135; // Example width calculation
  const CARD_HEIGHT = CARD_WIDTH / ASPECT_RATIO;



  const Square = React.memo(({ text, isSelected, onPress }) => (
    <Pressable
      style={({ pressed }) => [
        styles.square,
        isSelected ? styles.selectedSquare : styles.unselectedSquare,
        { width: CARD_WIDTH, height: CARD_HEIGHT },
        { opacity: pressed ? 0.4 : opacity },
      ]}
      onPress={() => onPress()}
    >
      <Text style={styles.exerciseContainertItemText}>{text}</Text>
    </Pressable>
  ));



  const changeSelectedElements = () => {
    if (currentSelectedExercises.length === 0) {
      setCurrentSelectedExercises(currentSubjectExercises)
    } else {
      setCurrentSelectedExercises([])
    }
  }

  const toggleSelection = useCallback((exercise) => {
    requestAnimationFrame(() => {
      setCurrentSelectedExercises(prevSelected => {
        if (prevSelected.includes(exercise)) {
          return prevSelected.filter(item => item !== exercise);
        } else {
          return [...prevSelected, exercise];
        }
      });
    });
  }, []);

  const startExercises = async () => {
    setPending(true)
    await setCurrentSubjectSelectedExercises(currentSelectedExercises)
    navigation.navigate('Topic')
    setPending(false)
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.titleWrapper}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 30, fontWeight: 'bold', letterSpacing: 1 }}>
            {currentSubject}
          </Text>
        </View>
        <View style={styles.descriptionWrapper}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
            {translate('customizeExerciseScreen.headerDescription')}
          </Text>
        </View>
        <View style={styles.separator} />
        <TouchableOpacity
          style={[styles.changeSelectedElementsButton, currentSelectedExercises.length === 0 ? { borderColor: '#02cfc5' } : { borderColor: '#6252b0' }]}
          onPress={() => changeSelectedElements()}
        >
          {currentSelectedExercises.length === 0 ? (
            <Text style={styles.changeSelectedElementsButtonText}>
              {translate('customizeExerciseScreen.selectAllExercises')}
            </Text>
          ) : (
            <Text style={styles.changeSelectedElementsButtonText}>
              {translate('customizeExerciseScreen.deselectAllExercises')}
            </Text>
          )}
        </TouchableOpacity>
        <View style={styles.exerciseContainer}>
          {currentSubjectExercises.map((exercise, index) => (
            <Square
              key={index}
              text={exercise}
              isSelected={currentSelectedExercises.includes(exercise)}
              exercise={exercise}
              onPress={() => toggleSelection(exercise)}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={() => startExercises()}
          disabled={currentSelectedExercises.length === 0 || pending}
          style={[
            styles.submitButton,
            (currentSelectedExercises.length === 0 || pending) && { backgroundColor: "#006862" },
          ]}
        >
          {pending ? (
            <ActivityIndicator
              size={'large'}
              color="#A59CFB"
            />
          ) : (
            <Text style={[
              styles.submitButtonText,
              (currentSelectedExercises.length === 0 || pending) && { color: "#8d8d8d" }
            ]}>
              {translate('customizeExerciseScreen.startExercising')}
            </Text>
          )}
        </TouchableOpacity>
        <View style={styles.emptyness} />
      </KeyboardAwareScrollView>
    </View>
  )
}

export default CustomizeExerciseScreen
