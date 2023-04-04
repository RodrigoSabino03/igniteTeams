import { useState } from "react";
import { FlatList } from "react-native";

import { Button } from "@components/Button";
import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { ListEmpty } from "@components/ListEmpty";
import { PlayerCard } from "@components/PlayerCard";


import { Container, Content, Form, HeaderList, NumbersOfPlayers } from "./styles";

export function Players(){
    const [team, setTeam] = useState('time A')
    const [players, setPlayers] = useState([])

    function handleRemovePlayer(){

    }

    return(
        <Container>
            <Header showBackButton />
            <Content>
                <Highlight
                    title="Nome da turma"
                    subtitle="adicione a galera e separe os times"
                />
                <Form>
                    <Input
                        placeholder="Nome do participante"
                        autoCorrect={false}
                    />
                    <ButtonIcon icon="add" />
                </Form>
                <HeaderList>
                    <FlatList
                        data={['time A', 'time B']}
                        keyExtractor={item => item}
                        renderItem={({ item }) => (
                            <Filter
                                title={item}
                                isActive={item === team}
                                onPress={() => setTeam(item)}
                            />
                        )}
                        horizontal
                    />
                    <NumbersOfPlayers>{players.length}</NumbersOfPlayers>
                </HeaderList>

                <FlatList
                    data={players}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <PlayerCard
                            name={item}
                            onRemove={handleRemovePlayer}
                        />          
                    )}
                    ListEmptyComponent={() => <ListEmpty message='Não ha pessoa nesse time' />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        { paddingBottom: 100 },
                        players.length === 0 && { flex: 1 }
                    ]}
                />


            </Content>
            <Button
                title="Remover turma"
                type="SECONDARY"
            />
        </Container>
    )
}