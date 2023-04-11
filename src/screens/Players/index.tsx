import { useEffect, useState, useRef } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Button } from "@components/Button";
import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { ListEmpty } from "@components/ListEmpty";
import { PlayerCard } from "@components/PlayerCard";


import { Container, Content, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroup } from "@storage/player/playersGetByGroup";
import { playerAddByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";

type RouteParams = {
    group: string;
}

export function Players(){
    const [newPlayerName, setNewPlayerName] = useState('');
    const [team, setTeam] = useState('time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

    const route = useRoute()
    const { group } = route.params as RouteParams 

    const newPlayerNameInputRef = useRef<TextInput>(null)

    const navigation = useNavigation()

    async function groupRemove(){
        try {
            await groupRemoveByName(group);
            navigation.navigate('groups')
        } catch (error) {
            console.log(error)
        }
    }

    async function handleGroupRemove() {
        Alert.alert(
            'Deseja mesmo remover o grupo?',
            '',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: async () => groupRemove()},
            ],
        )
    }
    async function handleRemovePlayer(playerName: string){
        try {
           await playerRemoveByGroup(playerName, group)
           fetchPlayersByTeam();
        } catch (error) {
            console.log(error)
        }
    }



    async function handleAddPlayer(){
        if(newPlayerName.trim().length === 0){
            return Alert.alert('New PLayer', 'enter the name of the person to add')
        }

        const newPlayer = {
            name: newPlayerName,
            team
        }

        try {
            await playerAddByGroup(newPlayer, group);

            newPlayerNameInputRef.current?.blur()

            setNewPlayerName('')
            fetchPlayersByTeam();
        } catch (error) {
            if(error instanceof AppError){
                Alert.alert('Nova pessoa', error.message)
            } else {
                console.log(error)
            }
        }
    }

    async function fetchPlayersByTeam() {
        try {
            const playersByTeam = await playerAddByGroupAndTeam(group, team)
            setPlayers(playersByTeam)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() =>{
        fetchPlayersByTeam()
    }, [team])

    return(
        <Container>
            <Header showBackButton />
            <Content>
                <Highlight
                    title={group}
                    subtitle="adicione a galera e separe os times"
                />
                <Form>
                    <Input
                        value={newPlayerName}
                        placeholder="Nome do participante"
                        autoCorrect={false}
                        onChangeText={e => setNewPlayerName(e)}
                        inputRef={newPlayerNameInputRef}
                        onSubmitEditing={handleAddPlayer}
                        returnKeyType='done'
                    />
                    <ButtonIcon icon="add" onPress={handleAddPlayer} />
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
                    keyExtractor={item => item.name}
                    renderItem={({ item }) => (
                        <PlayerCard
                            name={item.name}
                            onRemove={() => handleRemovePlayer(item.name)}
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
                onPress={handleGroupRemove}
            />
        </Container>
    )
}