import dayjs, { Dayjs } from "dayjs";
import { z } from "zod";

export const parseDate = (dateString: string): Dayjs => dayjs(dateString);

export const toApiDate = (date: Dayjs): string => date.format('YYYY-MM-DD');

export const toApiDateTime = (date: Dayjs): string => date.format('YYYY-MM-DDTHH:mm:ss');

export const formatDateTime = (date?: Dayjs): string => date?.format('L LT') ?? '';

export const dateValidationSchema = z.custom<Dayjs>((val: Dayjs) => val instanceof dayjs && val.isValid(), 'Data inválida');

export const apiDateTimeToDateSchema = z.string().transform(data => parseDate(data));

export const apiDateToDateSchema = z.string().transform(data => parseDate(data));

export const dateToApiDateSchema = dateValidationSchema.transform(data => toApiDate(data));

export const dateToApiDateTimeSchema = dateValidationSchema.transform(data => toApiDateTime(data));