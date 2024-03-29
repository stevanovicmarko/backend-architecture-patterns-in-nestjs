import { Alarm } from '../alarm';
import { randomUUID } from 'crypto';
import { AlarmSeverity } from '../value-objects/alarm-severity';
import { Injectable } from '@nestjs/common';
import { AlarmItem } from '../alarm-item';
import { AlarmCreatedEvent } from '../events/alarm-created.event';

@Injectable()
export class AlarmFactory {
  create(
    name: string,
    severity: string,
    triggeredAt: Date,
    items: Array<{
      name: string;
      type: string;
    }>,
  ): Alarm {
    const alarmId = randomUUID();
    const alarmSeverity = new AlarmSeverity(severity as AlarmSeverity['value']);
    const alarm = new Alarm(alarmId);

    alarm.name = name;
    alarm.severity = alarmSeverity;
    alarm.triggeredAt = triggeredAt;

    const alarmItems = items.map(
      (item) => new AlarmItem(randomUUID(), item.name, item.type),
    );

    for (const item of alarmItems) {
      alarm.addAlarmItem(item);
    }
    alarm.apply(new AlarmCreatedEvent(alarm), { skipHandler: true }); // skipHandler is a custom option to avoid
    // calling the local event handler
    return alarm;
  }
}
