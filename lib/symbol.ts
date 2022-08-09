import elparser from 'elparser';

export default function symbol(name: string) {
    return new elparser.ast.SExpSymbol(name);
}
