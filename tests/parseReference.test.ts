import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBible } from '../hooks/useBible';
import { BIBLE_BOOKS } from '../utils/bibleData';

const abbrevOf = (name: string) => BIBLE_BOOKS.find(b => b.name === name)!.abbrev[0];

const parse = (query: string) => {
    const { result } = renderHook(() => useBible());
    return result.current.parseReference(query);
};

describe('parseReference (busca local por referência)', () => {
    it('formato padrão "ap 11:4"', () => {
        expect(parse('ap 11:4')).toMatchObject({
            book: abbrevOf('Apocalipse'), chapter: 11, verse: 4
        });
    });

    it('aceita ponto, sem espaço e espaços extras', () => {
        for (const query of ['ap 11.4', 'ap11:4', 'ap11.4', 'AP  11 . 4', 'ap 11 4']) {
            expect(parse(query), query).toMatchObject({ chapter: 11, verse: 4 });
        }
    });

    it('nome completo do livro', () => {
        expect(parse('apocalipse 11:4')).toMatchObject({
            book: abbrevOf('Apocalipse'), chapter: 11, verse: 4
        });
    });

    it('intervalo de versículos "gn 1:1-3"', () => {
        expect(parse('gn 1:1-3')).toMatchObject({
            book: abbrevOf('Gênesis'), chapter: 1, verse: 1, endVerse: 3
        });
    });

    it('só capítulo: "sl 23" retorna o capítulo inteiro', () => {
        const ref = parse('sl 23');
        expect(ref).toMatchObject({ book: abbrevOf('Salmos'), chapter: 23 });
        expect(ref?.verse).toBeUndefined();
    });

    it('só o livro: "salmos" abre no capítulo 1', () => {
        expect(parse('salmos')).toMatchObject({
            book: abbrevOf('Salmos'), chapter: 1, verse: 1
        });
    });

    it('formato compacto "ap11" trata o número como capítulo', () => {
        expect(parse('ap11')).toMatchObject({ chapter: 11, verse: 1 });
    });

    it('livros de capítulo único tratam dígito como versículo (ex.: Judas)', () => {
        const judas = BIBLE_BOOKS.find(b => b.name === 'Judas')!;
        expect(parse(`${judas.abbrev[0]}5`)).toMatchObject({ chapter: 1, verse: 5 });
    });

    it('livros numerados: "1co 13:4"', () => {
        const ref = parse('1co 13:4');
        expect(ref).not.toBeNull();
        expect(ref).toMatchObject({ chapter: 13, verse: 4 });
    });

    it('consulta que não é referência retorna null (vai para a IA)', () => {
        expect(parse('quero uma palavra de esperança')).toBeNull();
        expect(parse('zzz 1:1')).toBeNull();
        expect(parse('')).toBeNull();
    });
});
