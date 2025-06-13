import React, { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendario.css';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const messages = {
  allDay: 'Dia todo',
  previous: 'Anterior',
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Não há eventos neste período.',
  showMore: total => `+ Ver mais (${total})`,
};

const eventStyleGetter = (event) => {
  let backgroundColor = '#3b82f6';

  if (event.resource?.status === 'Paga') {
    backgroundColor = '#22c55e';
  } else if (event.resource?.status === 'Atrasada') {
    backgroundColor = '#ef4444';
  }

  return {
    style: {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    },
  };
};

function CalendarioFaturas({ faturas }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');

  const eventosFaturas = useMemo(() => {
    if (!Array.isArray(faturas)) return [];

    return faturas.map(fatura => {
      const dataVencimento = new Date(fatura.vencimento);
      dataVencimento.setMinutes(dataVencimento.getMinutes() + dataVencimento.getTimezoneOffset());

      return {
        title: `${fatura.descricao} - ${fatura.valor.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}`,
        start: dataVencimento,
        end: dataVencimento,
        allDay: true,
        resource: fatura,
      };
    });
  }, [faturas]);

  return (
    <div style={{ height: '700px', width: '100%', overflow: 'auto' }}>
      {eventosFaturas.length === 0 && (
        <p className="nenhuma-fatura-msg">Nenhuma fatura encontrada para exibir no calendário.</p>
      )}

      {eventosFaturas.length > 0 && (
        <Calendar
          localizer={localizer}
          events={eventosFaturas}
          startAccessor="start"
          endAccessor="end"
          messages={messages}
          culture="pt-BR"
          eventPropGetter={eventStyleGetter}
          defaultView="month"
          views={['month', 'week', 'day', 'agenda']}
          date={currentDate}
          onNavigate={setCurrentDate}
          view={currentView}
          onView={setCurrentView}
          popup // ativa o popup do "+ Ver mais"
        />
      )}
    </div>
  );
}

export default CalendarioFaturas;
