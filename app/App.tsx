import { Text, View, Button, ScrollView } from "react-native";
import { styles } from './Styles';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { functions } from './Functions';

LocaleConfig.locales['custom'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
  ],
  dayNamesShort: [
    'D', 'S', 'T', 'Q', 'Q', 'S', 'S'
  ]
};

LocaleConfig.defaultLocale = 'custom';

const months = [
  { name: "Jan", date: "2026-01-01", min: "2026-01-01", max: "2026-01-31" },
  { name: "Fev", date: "2026-02-01", min: "2026-02-01", max: "2026-02-28" },
  { name: "Mar", date: "2026-03-01", min: "2026-03-01", max: "2026-03-31" },
  { name: "Abr", date: "2026-04-01", min: "2026-04-01", max: "2026-04-30" },
  { name: "Mai", date: "2026-05-01", min: "2026-05-01", max: "2026-05-31" },
  { name: "Jun", date: "2026-06-01", min: "2026-06-01", max: "2026-06-30" },
  { name: "Jul", date: "2026-07-01", min: "2026-07-01", max: "2026-07-31" },
  { name: "Ago", date: "2026-08-01", min: "2026-08-01", max: "2026-08-31" },
  { name: "Set", date: "2026-09-01", min: "2026-09-01", max: "2026-09-30" },
  { name: "Out", date: "2026-10-01", min: "2026-10-01", max: "2026-10-31" },
  { name: "Nov", date: "2026-11-01", min: "2026-11-01", max: "2026-11-30" },
  { name: "Dez", date: "2026-12-01", min: "2026-12-01", max: "2026-12-31" }
];

export default function App() {

  const rows = [];
  for (let i = 0; i < months.length; i += 3) {
    rows.push(months.slice(i, i + 3));
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>

      <View style={styles.header}>
        <Text style={styles.title}>2026</Text>
        <Button title="⋮" color={'black'} onPress={functions.clicked} />
      </View>

      <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>

        {rows.map((row, rowIndex) => (
          <View style={[styles.row, { justifyContent: "space-around", marginBottom: 20 }]} key={rowIndex}>

            {row.map((month, index) => (
              <Calendar
                key={index}
                initialDate={month.date}
                minDate={month.min}
                maxDate={month.max}
                hideArrows={true}
                hideExtraDays={true}

                renderHeader={() => (
                  <Text style={{ color: "white", fontSize: 20, textAlign: "left" }}>
                    {month.name}
                  </Text>
                )}

                theme={{
                  backgroundColor: "#000",
                  calendarBackground: "#000",
                  textSectionTitleColor: "white",
                  dayTextColor: "#aaa",
                  monthTextColor: "white",
                  textDayFontSize: 12,
                  textDayHeaderFontSize: 10,
                  todayTextColor: "#ff0000",
                  selectedDayTextColor: "#ffffff",
                }}

                onDayPress={(day) => {
                  console.log("Dia selecionado", day.dateString);
                }}
              />
            ))}

          </View>
        ))}

      </ScrollView>

    </View>
  );
}