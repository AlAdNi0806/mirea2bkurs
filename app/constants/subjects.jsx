import { useLanguage } from "../context/LanguageContext";

export function confirmedSubjects() {
 const [translate] = useLanguage();

 const subjects = [
    {
      title: translate('aiScreen.subjectRussian'),
      description: translate('aiScreen.subjectRussianDescription'),
      exercises: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
      icon: 'pencil',
      subject: 'Russian',
      shortened: 'Rus'
    },
    {
      title: translate('aiScreen.subjectEssay'),
      icon: 'create-outline',
      subject: 'Essay',
      scanning: true
    },
    {
      title: translate('aiScreen.subjectPhysics'),
      icon: 'logo-react',
      subject: 'Physics',
      comingSoon: true
    },
 ];

 return subjects;
}
